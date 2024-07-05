import json
import boto3
import os
from google.cloud import language_v2
from botocore.exceptions import ClientError
from decimal import Decimal

 
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Feedback')
s3_client = boto3.client('s3')

def download_credentials(bucket_name, object_name, file_name):
    try:
        s3_client.download_file(bucket_name, object_name, file_name)
        print("file downloaded")
         
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = file_name
    except ClientError as e:
        print(f"Error downloading file from S3: {e}")
        raise

def analyze_sentiment(text_content: str):
    client = language_v2.LanguageServiceClient()

    document = {
        "content": text_content,
        "type_": language_v2.Document.Type.PLAIN_TEXT,
        "language_code": "en",
    }

    response = client.analyze_sentiment(
        request={"document": document, "encoding_type": language_v2.EncodingType.UTF8}
    )

    sentiment = {
        'score': Decimal(str(response.document_sentiment.score)),
        'magnitude': Decimal(str(response.document_sentiment.magnitude)),
    }
    print(f"sentiment: {sentiment}")
    return sentiment

def lambda_handler(event, context):
     
    download_credentials('google-natural-language-api-key', 'iot-data-management-be8d8f550ff4.json', '/tmp/iot-data-management-be8d8f550ff4.json')

    for record in event['Records']:
        if record['eventName'] == 'INSERT':
            print("record received")
            new_image = record['dynamodb']['NewImage']
            feedback_id = new_image['feedbackId']['S']
            feedback_text = new_image['feedbackText']['S']
            
             
            sentiment = analyze_sentiment(feedback_text)
            
             
            table.update_item(
                Key={'feedbackId': feedback_id},
                UpdateExpression='SET sentimentScore = :score, sentimentMagnitude = :magnitude',
                ExpressionAttributeValues={
                    ':score': sentiment['score'],
                    ':magnitude': sentiment['magnitude']
                }
            )
            print("table updated")
    return {
        'statusCode': 200,
        'body': json.dumps('Sentiment analysis completed')
    }
