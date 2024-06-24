import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:987020a2-47ef-41e4-bf80-11936c848edc',
  }),
});

const lexruntime = new AWS.LexRuntime();
