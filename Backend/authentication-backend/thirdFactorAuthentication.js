const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const snsClient = new SNSClient({});

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET"
    }
  };

  const { email, secretKeyVerify } = event.queryStringParameters;

  // Validate input
  if (!email || !secretKeyVerify) {
    return {
      ...response,
      statusCode: 400,
      body: JSON.stringify({ message: 'Email and secretKey are required' }),
    };
  }

  // Fetch encrypted secret key and encryption shift from DynamoDB
  const getParams = {
    TableName: 'User',
    Key: { email },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(getParams));

    if (!data.Item) {
      return {
        ...response,
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    const { secretKey, shiftValue,topicArn, firstName} = data.Item;

    // Decrypt the secret key using Caesar cipher and the shift value from DynamoDB
    const decryptedSecretKey = decryptCaesarCipher(secretKey, shiftValue);

    // Compare decrypted secret key with user-provided secret key
    if (secretKeyVerify !== decryptedSecretKey) {
      return {
        ...response,
        statusCode: 403,
        body: JSON.stringify({ message: 'Incorrect secret key' }),
      };
    }
    
    
    if(topicArn)
    {  
      const publishParams = {
        TopicArn: topicArn,
        Message: `Welcome to Dal-Vacation-Home, ${firstName}. \n You are now logged in. Start using our services.`,
        Subject: 'User Login at Dal-Vacation-Home',
      };
      
    
   
      try {
        await snsClient.send(new PublishCommand(publishParams));
      } catch (snsError) {
        console.error('Error sending SNS message:', snsError);
        // Handle the error appropriately, such as returning an error response
        // return {
        //   ...response,
        //   statusCode: 500,
        //   body: { message: 'Error sending registration success email' }
        // };
      }
    }
    
    return {
      ...response,
      statusCode: 200,
      body: JSON.stringify({ message: 'Authentication successful' }),
    };
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    return {
      ...response,
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching data from DynamoDB' }),
    };
  }
};

// Decrypts the Caesar cipher encrypted text
function decryptCaesarCipher(encryptedText, shift) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  let decryptedText = '';

  for (let i = 0; i < encryptedText.length; i++) {
    const char = encryptedText[i];
    const index = alphabet.indexOf(char.toLowerCase());

    if (index === -1) {
      // If character is not in the alphabet (like spaces or punctuation), keep it unchanged
      decryptedText += char;
    } else {
      // Decrypt the character using the shift
      let decryptedIndex = (index - shift + alphabet.length) % alphabet.length;
      if (decryptedIndex < 0) {
        decryptedIndex += alphabet.length; // Handle negative indices
      }
      decryptedText += char === char.toUpperCase() ? alphabet[decryptedIndex].toUpperCase() : alphabet[decryptedIndex];
    }
  }

  return decryptedText;
}
 