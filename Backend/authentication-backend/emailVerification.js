const { CognitoIdentityProviderClient, ConfirmSignUpCommand, ResendConfirmationCodeCommand } = require('@aws-sdk/client-cognito-identity-provider');

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    }
  };
  
  // Extract parameters from the event
  const { action, email, verificationCode } = event;

  // Create an instance of the Cognito Identity Provider client
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

  try {
    if (action === 'sendVerificationCode') {
      // Create a command to resend confirmation code
      const resendCommand = new ResendConfirmationCodeCommand({
        ClientId: '7obkafbfl095gprlo6gli6je55',
        Username: email,
      });

      // Send the resend command to Cognito
      const data = await client.send(resendCommand);
      console.log('Resend confirmation code response:', data);

      return {
        ...response,
        body: { message: 'Verification code sent successfully' }
      };
    } else if (action === 'verifyVerificationCode') {
      // Create a command to confirm the sign-up
      const confirmCommand = new ConfirmSignUpCommand({
        ClientId: '7obkafbfl095gprlo6gli6je55',
        Username: email,
        ConfirmationCode: verificationCode
      });

      // Send the confirmation command to Cognito
      const data = await client.send(confirmCommand);
      console.log('Confirmation response:', data);

      // If confirmation is successful, data will contain relevant information
      return {
        ...response,
        body: { message: 'Email verification successful' }
      };
    } else {
      return {
        ...response,
        statusCode: 400,
        body: { message: 'Invalid action specified' }
      };
    }
  } catch (error) {
    console.error('Error processing action:', error);
    return {
      ...response,
      statusCode: 500,
      body: { message: 'Error processing action', error: error.message }
    };
  }
};
