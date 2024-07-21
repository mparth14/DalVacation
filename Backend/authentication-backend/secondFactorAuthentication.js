const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const snsClient = new SNSClient({});


// Caesar Cipher encryption function
const caesarCipherEncrypt = (text, shift) => {
  return text.split('').map(char => {
    const code = char.charCodeAt();
    // Encrypt letters only
    if (char >= 'a' && char <= 'z') {
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    } else if (char >= 'A' && char <= 'Z') {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }
    return char;
  }).join('');
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

  const action = event.action;

  if (action === "add") {
    console.log(event.body);
    const { email, favoriteColor, cityBorn, favoriteSports, secretKey } = event.body;
    
    // Validate input
    if (!email || !favoriteColor || !cityBorn || !favoriteSports || !secretKey) {
      return {
        ...response,
        statusCode: 400,
        body: { message: 'Email, favorite color, city born, favorite sports, and secret key are required' },
      };
    }

    // Caesar cipher shift value
    const shift = 3; // You can change this value as needed
    const encryptedKey = caesarCipherEncrypt(secretKey, shift);

    // Construct the update expression
    let updateExpression = 'SET';
    const expressionAttributeValues = {};

    if (favoriteColor) {
      updateExpression += ' favoriteColor = :favoriteColor,';
      expressionAttributeValues[':favoriteColor'] = favoriteColor;
    }
    if (cityBorn) {
      updateExpression += ' cityBorn = :cityBorn,';
      expressionAttributeValues[':cityBorn'] = cityBorn;
    }
    if (favoriteSports) {
      updateExpression += ' favoriteSports = :favoriteSports,';
      expressionAttributeValues[':favoriteSports'] = favoriteSports;
    }
    updateExpression += ' secretKey = :secretKey, shiftValue = :shiftValue,';
    expressionAttributeValues[':secretKey'] = encryptedKey;
    expressionAttributeValues[':shiftValue'] = shift;

    // Remove trailing comma
    updateExpression = updateExpression.slice(0, -1);

    const params = {
      TableName: 'User',
      Key: { email },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW"
    };
    
      // Fetch encrypted secret key and encryption shift from DynamoDB
    const getParams = {
      TableName: 'User',
      Key: { email },
    };


    try {
      const result = await ddbDocClient.send(new UpdateCommand(params));
      const data = await ddbDocClient.send(new GetCommand(getParams));
      if (!data.Item) {
      return {
        ...response,
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    const { topicArn, firstName} = data.Item;

      // Send registration success email via SNS
      const publishParams = {
        TopicArn: topicArn,
        Message: `Welcome to Dal-Vacation-Home, ${firstName}. To get started, log in with your credentials and start exploring our services.`,
        Subject: 'User Registration',
      };
    
  
 
    try {
      await snsClient.send(new PublishCommand(publishParams));
    } catch (snsError) {
      console.error('Error sending SNS message:', snsError);
      // Handle the error appropriately, such as returning an error response
          // console.error('Error sending registration success email', snsError);
      // return {
      //   ...response,
      //   statusCode: 500,
      //   body: { message: 'Error sending registration success email' }
      // };
    }
      
      return {
        ...response,
        statusCode: 200,
        body: { message: 'Security questions and secret key added successfully', updatedAttributes: result.Attributes }
      };
    } catch (error) {
      console.error('Error adding security questions:', error);
      return {
        ...response,
        statusCode: 500,
        body: { message: `Error adding security questions: ${error.message}` }
      };
    }
  } else if (action === "fetch") {
    const { email, columns } = event.body;
    
    // Validate input
    if (!email || !columns || !Array.isArray(columns) || columns.length === 0) {
      return {
        ...response,
        statusCode: 400,
        body: { message: 'Email and non-empty array of columns are required' },
      };
    }

    const params = {
      TableName: 'User',
      Key: { email }
    };

    try {
      const data = await ddbDocClient.send(new GetCommand(params));
      if (!data.Item) {
        return {
          ...response,
          statusCode: 404,
          body: { message: 'User not found' }
        };
      }

      const result = {};
      columns.forEach(column => {
        if (data.Item[column]) {
          result[column] = data.Item[column];
        }
      });

      return {
        ...response,
        statusCode: 200,
        body: result
      };
    } catch (error) {
      console.error('Error fetching columns:', error);
      return {
        ...response,
        statusCode: 500,
        body: { message: `Error fetching columns: ${error.message}` }
      };
    }
  } else {
    return {
      ...response,
      statusCode: 400,
      body: { message: 'Invalid action' }
    };
  }
};