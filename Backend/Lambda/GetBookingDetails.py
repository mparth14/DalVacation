import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    bot = event['bot']['name']
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']
    
    # Extract the booking reference code from the Lex input
    booking_id = slots['BookingID']['value']['originalValue']
    
    if not booking_id:
        return {
            'statusCode': 400,
            'body': json.dumps({
                'message': 'BookingID slot is required but not provided'
            })
        }
    
    # Initialize a DynamoDB client
    dynamodb = boto3.client('dynamodb')
    
    try:
        # Query the DynamoDB table
        response = dynamodb.get_item(
            TableName='Booking',
            Key={
                'booking_id': {'S': booking_id}
            }
        )
        
        if 'Item' in response:
            item = response['Item']
            check_in_date = item['check_in_date']['S']
            check_out_date = item['check_out_date']['S']
            email = item['email']['S']
            room_id = item['room_id']['S']
            status = item['status']['S']
            
            message = (f"Booking ID {booking_id} Details:\n"
                       f"Check-In Date: {check_in_date}\n"
                       f"Check-Out Date: {check_out_date}\n"
                       f"Email: {email}\n"
                       f"Room ID: {room_id}\n"
                       f"Status: {status}")
        else:
            message = f"Booking ID {booking_id} not found."

        
    except ClientError as e:
        message = f"Error fetching booking details: {e.response['Error']['Message']}"
    
    return {
    'sessionState': {
      'intent': {
        'name': intent,
        },
     'dialogAction': {
        'type': 'ElicitIntent',
      }
    },
    'messages': [
      {
        'contentType': 'PlainText',
        'content': message
      }
    ]
  }

