const functions = require('@google-cloud/functions-framework');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

AWS.config.update({
    accessKeyId: 'AKIA2IROBIIOYIZMURUT',
    secretAccessKey: 'rvJLhdBPnXpBQggcyXqfIUXGZEskZTaL/6shk8+S',
    region: 'us-east-1' // Replace with your AWS region
});

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });


// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent('helloPubSub', async (cloudEvent) =>  {
  // The Pub/Sub message is passed as the CloudEvent's data payload.
  const base64name = cloudEvent.data.message.data;
    console.log(base64name)
    const message = Buffer.from(base64name, 'base64').toString();
    const messageData = JSON.parse(message);

    const bookingId = messageData.booking_id;
    const concern = messageData.concern;
    const userId = messageData.user_id;
    const userEmail = messageData.user_email;
    const userName = messageData.user_name;

    // Fetch property agents from Cognito user pool group
    const params = {
        UserPoolId: 'us-east-1_D8LhOZMJq',
        GroupName: 'property-agents'
    };

    try {
        const data = await cognitoIdentityServiceProvider.listUsersInGroup(params).promise();
        const agentList = await Promise.all(data.Users.map(async (user) => {
            const userParams = {
                UserPoolId: 'us-east-1_D8LhOZMJq',
                Username: user.Username
            };
            const userData = await cognitoIdentityServiceProvider.adminGetUser(userParams).promise();

            const attributes = userData.UserAttributes.reduce((acc, attr) => {
                acc[attr.Name] = attr.Value;
                return acc;
            }, {});

            return {
                Username: user.Username,
                FirstName: attributes['given_name'] || 'N/A',
                Email: attributes['email'] || 'N/A'
            };
        }));

        

        if (agentList.length === 0) {
            throw new Error('No property agents found in the group');
        }

        // Select a random agent
        const selectedAgent = agentList[Math.floor(Math.random() * agentList.length)];



        // Log the concern to Firestore
        const logId = uuidv4();
        const logItem = {
            LogID: logId,
            AgentName: selectedAgent.FirstName ,
            AgentEmail: selectedAgent.Email,
            AgentId: selectedAgent.Username,
            BookingId: bookingId,
            Concern: concern,
            Status: 'pending',
            UserId: userId,
            UserEmail: userEmail,
            UserName: userName,
            Timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('CommunicationLogs').doc(logId).set(logItem);

        console.log(`Concern forwarded to agent: ${selectedAgent}`);
    } catch (error) {
        console.error('Error fetching property agents:', error);
    }



});
