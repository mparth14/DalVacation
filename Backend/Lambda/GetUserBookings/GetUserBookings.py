import json
import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = 'Booking'
def lambda_handler(event, context):
    print("Event: ", event)

    # Extract email from the event body or query parameters
    if 'body' in event:
        try:
            body = json.loads(event['body'])
            email = body.get('email', None)
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Invalid JSON in request body'})
            }
    else:
        email = event.get('queryStringParameters', {}).get('email', None)
    
    if not email:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Email is required'})
        }

    table = dynamodb.Table(TABLE_NAME)
    
    try:
        response = table.scan(
            FilterExpression=Attr('email').eq(email)
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps(response['Items'])
        }
        
    except Exception as e:
        print(f"Error querying DynamoDB: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not fetch bookings'})
        }
