import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    bot = event['bot']['name']
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']
    
    print(bot)
    print(slots['BookingID']['value']['originalValue'])
    print(intent)
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
            room_number = response['Item']['room_number']['S']
            message = f"Booking {booking_id} has Room Number {room_number}."
        else:
            message = f"Booking ID {booking_id} not found."
        
    except ClientError as e:
        message = f"Error fetching booking details: {e.response['Error']['Message']}"
    
    # Return the message to Lex
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

