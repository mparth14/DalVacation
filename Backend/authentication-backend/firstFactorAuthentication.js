const { CognitoIdentityProviderClient, InitiateAuthCommand, AdminListGroupsForUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
          const { DynamoDBClient, UpdateItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

          const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
          const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
          const ddbDocClient = DynamoDBDocumentClient.from(dbClient);

const snsClient = new SNSClient({});

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
                "Access-Control-Allow-Methods": "OPTIONS,GET"
              }
            };
            

            const { email, password } = event.queryStringParameters;

            if (!email || !password) {
              return {
                ...response,
                statusCode: 400,
                body: { message: 'Email and password are required' },
              };
            }

            try {
              // Authenticate user and get tokens using the login function
              const tokens = await login(email, password);


              // Fetch encrypted secret key and encryption shift from DynamoDB
              const getParams = {
                TableName: 'User',
                Key: { email },
              };

              const data = await ddbDocClient.send(new GetCommand(getParams));
              if (!data.Item) {
                return {
                  ...response,
                  statusCode: 404,
                  body: JSON.stringify({ message: 'User not found' }),
                };
              }
        
              const { cityBorn, favoriteColor, favoriteSports, secretKey, topicArn, firstName} = data.Item;


              // Check if user is verified
              // const userResponse = await getUserAttributes(email);

              // Check if security questions and secret key exist
              // const { cityBorn, favoriteColor, favoriteSports, secretKey, firstName } = userResponse.Item;
    
              if (!cityBorn || !favoriteColor || !favoriteSports || !secretKey || !firstName) {
                return {
                  ...response,
                  statusCode: 400,
                  body: { message: 'Security questions and secret key are required for your account.' },
                };
              }

              // Check if user belongs to required groups
              const groupInfo = await checkUserGroups(email);

              // Update user's tokens in DynamoDB
              const updateTokensParams = {
                TableName: process.env.USERS_TABLE_NAME,
                Key: {
                  email: { S: email },
                },
                UpdateExpression: "SET accessToken = :accessToken, refreshToken = :refreshToken",
                ExpressionAttributeValues: {
                  ":accessToken": { S: tokens.accessToken },
                  ":refreshToken": { S: tokens.refreshToken },
                },
              };

              try {
                await dbClient.send(new UpdateItemCommand(updateTokensParams));
                console.log("Tokens updated in DynamoDB for user:", email);
              } catch (updateError) {
                console.error("Error updating tokens in DynamoDB:", updateError);
                return {
                  ...response,
                  statusCode: 400,
                  body: { message: 'Error updating tokens in DynamoDB.' },
                };
              }
            
              // if(topicArn){
              //     // Send registration success email via SNS
              //   const publishParams = {
              //     TopicArn: String(topicArn),
              //     Message: `Welcome to Dal-Vacation-Home, ${firstName}. To get started, log in with your credentials and start exploring our services.`,
              //     Subject: 'User logged in',
              //   };
          
              //   try {
              //     await snsClient.send(new PublishCommand(publishParams));
              //   } catch (snsError) {
              //     console.error('Error sending SNS message:', snsError);
              //     // Handle the error appropriately, such as returning an error response
              //     return {
              //       ...response,
              //       statusCode: 500,
              //       body: { message: 'Error sending registration success email' }
              //     };
              //   }
              // }
              // Return successful response with tokens and group information
              
              
              const userData = await ddbDocClient.send(new GetCommand(getParams));
              if (!userData.Item) {
                return {
                  ...response,
                  statusCode: 404,
                  body: JSON.stringify({ message: 'User not found' }),
                };
              }


              return {
                ...response,
                statusCode: 200,
                body:JSON.stringify({
                  groups: groupInfo,
                  user: userData.Item
                 }),
              };
            } catch (error) {
              console.error('Login failed:', error);
              // Return error response
              return {
                ...response,
                statusCode: 500,
                body: { message: 'Error during login.' + error.message },
              };
            }
          };

          const login = async (email, password) => {
            const initiateAuthParams = {
              AuthFlow: 'USER_PASSWORD_AUTH',
              ClientId: poolData.ClientId,
              AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
              },
            };

            try {
              // Initiate authentication
              const authResponse = await cognitoClient.send(new InitiateAuthCommand(initiateAuthParams));

              // Extract tokens
              const tokens = {
                accessToken: authResponse.AuthenticationResult.AccessToken,
                idToken: authResponse.AuthenticationResult.IdToken,
                refreshToken: authResponse.AuthenticationResult.RefreshToken,
              };

              return tokens;
            } catch (error) {
              console.error("Error during user authentication:", error);
              throw error;
            }
          };

          const getUserAttributes = async (email) => {
            const params = {
              TableName: process.env.USERS_TABLE_NAME,
              Key: {
                email: { S: email },
              },
            };

            try {
              const data = await dbClient.send(new GetItemCommand(params));
              return data;
            } catch (error) {
              console.error("Error fetching user attributes:", error);
              throw error;
            }
          };

          const checkUserGroups = async (email) => {
            const params = {
              UserPoolId: poolData.UserPoolId,
              Username: email,
            };

            try {
              const groupsResponse = await cognitoClient.send(new AdminListGroupsForUserCommand(params));
              const groups = groupsResponse.Groups.map(group => group.GroupName);

              return groups;
            } catch (error) {
              console.error("Error checking user groups:", error);
              throw error;
            }
          };