          const { CognitoIdentityProviderClient,SignUpCommand, AdminAddUserToGroupCommand } = require('@aws-sdk/client-cognito-identity-provider');
          const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { CreateTopicCommand, SubscribeCommand, SNSClient } = require('@aws-sdk/client-sns');

const snsClient = new SNSClient({ region: 'us-east-1' });
const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const ddbClient = new DynamoDBClient({ region: 'us-east-1' });

          const poolData = {
            UserPoolId: "us-east-1_D8LhOZMJq",
            ClientId: "7obkafbfl095gprlo6gli6je55",
          };

          exports.handler = async (event) => {

            const response = {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
              }
            };

            const { password, email, firstName, lastName, groupToAdd } = event; // used when testing from API Gateway

            // Validate input
            if (!password || !email || !firstName || !lastName) {
              return {
                ...response,
                statusCode: 400,
                body: { message: 'Password, email, first name, and last name are required' },
              };
            }

            // Prepare attributes
            const attributeList = [
              { Name: 'email', Value: email },
              { Name: 'given_name', Value: firstName },
              { Name: 'family_name', Value: lastName },
            ];

            // Prepare sign-up parameters
            const signUpParams = {
              ClientId: poolData.ClientId,
              Password: password,
              Username: email,
              UserAttributes: attributeList,
            };

try{
    const signUpData = await cognitoClient.send(new SignUpCommand(signUpParams));
    console.log('Sign up successful:', signUpData);

    // If user signed up successfully, assign them to a group
    const addUserToGroupParams = {
      GroupName: groupToAdd,
      Username: email,
      UserPoolId: poolData.UserPoolId,
    };

    await cognitoClient.send(new AdminAddUserToGroupCommand(addUserToGroupParams));
    console.log('User added to group:', groupToAdd);

    // Extract part of email before @ for topic name
    const userName = email.substring(0, email.indexOf('@'));
    const topicName = `topic-${userName}`;

    // Create an SNS topic with the modified topic name
    const createTopicParams = {
      Name: topicName,
    };

     // Generate a unique user_id
    const userId = signUpData.UserSub; // Using Cognito UserSub as user_id
    console.log('Creating SNS topic with name:', topicName);

    const createTopicResponse = await snsClient.send(new CreateTopicCommand(createTopicParams));
    const createdArn = createTopicResponse.TopicArn;
    console.log('SNS topic created:', createdArn);

    // Subscribe the user's email to the SNS topic
    const subscribeParams = {
      Protocol: 'email',
      Endpoint: email,
      TopicArn: createdArn,
    };

    await snsClient.send(new SubscribeCommand(subscribeParams));
    console.log(`Subscribed ${email} to topic:`, createdArn);

    // Store the user in DynamoDB
    const ddbParams = {
      TableName: 'User',
      Item: {
        'user_id': { S: userId },
        'email': { S: email },
        'firstName': { S: firstName },
        'password': { S: password },
        'lastName': { S: lastName },
        'topicArn': { S: createdArn }, // Store the created topic ARN in DynamoDB
        'userType': {S: groupToAdd},
      }
    };

    await ddbClient.send(new PutItemCommand(ddbParams));
    console.log('User stored in DynamoDB with topic ARN:', createdArn);

    // Return success response
    return {
      ...response,
      statusCode: 200,
      body: { message: 'User signed up successfully', topicArn: createdArn },
    };
  } catch (err) {
    console.error('Error signing up or adding user to group:', err);
    // Specific error handling
    let errorMessage = 'An error occurred while signing up the user.';
    if (err.name === 'UsernameExistsException') {
      errorMessage = 'An account with this email already exists.';
    } else if (err.name === 'InvalidPasswordException') {
      errorMessage = 'Password does not meet the required criteria.';
    } else if (err.name === 'InvalidParameterException') {
      errorMessage = 'Invalid parameter provided. Please check your input.';
    } else if (err.name === 'UserNotFoundException') {
      errorMessage = 'User not found.';
    } else if (err.name === 'NotAuthorizedException') {
      errorMessage = 'You are not authorized to perform this action.';
    } else if (err.name === 'ResourceNotFoundException') {
      errorMessage = 'The requested resource was not found.';
    }

    // Return error response
    return {
      ...response,
      statusCode: 500,
      body: { message: errorMessage },
    };
  }
};