import json
import boto3
from botocore.exceptions import ClientError
import requests

def lambda_handler(event, context):
    bot = event['bot']['name']
    intent = event['sessionState']['intent']['name']
    slots = event['sessionState']['intent']['slots']
    user_id = event['sessionId'] 
    print("slots: ", slots)
    print("session ID: ", user_id)
    
    # Initialize a DynamoDB client
    dynamodb = boto3.client('dynamodb')
    
    if intent == 'GetBookingDetails':
        booking_id = slots['BookingID']['value']['originalValue']

        if not booking_id:
            return {
                'sessionState': {
                    'intent': {
                        'name': intent,
                    },
                    'dialogAction': {
                        'type': 'ElicitSlot',
                        'slotToElicit': 'BookingID'
                    }
                },
                'messages': [
                    {
                        'contentType': 'PlainText',
                        'content': 'BookingID slot is required but not provided'
                    }
                ]
            }
        
        try:
            response = dynamodb.get_item(
                TableName='Booking',
                Key={'booking_id': {'S': booking_id}}
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
    
    elif intent == 'TalkToAgent':
        customer_issue = slots.get('CustomerIssue', {}).get('value', {}).get('originalValue', '')
        print("customer issue: ", customer_issue)
        
        if customer_issue:
            # Split the customer_issue string and assign to variables
            issue_parts = customer_issue.split(', ')
            if len(issue_parts) == 4:
                booking_id, concern, email_address, user_name = issue_parts
                message = (f"Thank you for reaching out, {user_name}. An agent will contact you at {email_address} "
                           f"regarding the issue with Booking ID {booking_id}: {concern}.")
                payload = {
                    "bookingId": booking_id,
                    "concern": concern,
                    "userId": user_id,
                    "userEmail": email_address,
                    "userName": user_name
                }
                
                # Make the API call
                api_url = 'https://us-central1-dal-vacation-home-429313.cloudfunctions.net/publishMessage'
                headers = {'Content-Type': 'application/json'}
                try:
                    response = requests.post(api_url, headers=headers, data=json.dumps(payload))
                    if response.status_code == 200:
                        message = f"Thank you for reaching out, {user_name}. An agent will contact you at {email_address} regarding the issue with Booking ID {booking_id}: {concern}."
                    else:
                        message = f"Failed to publish message. Status code: {response.status_code}"
                except requests.RequestException as e:
                    message = f"Error making the API call: {str(e)}"
            else:
                message = "The CustomerIssue value is not in the correct format."
        else:
            message = "No CustomerIssue provided."

    else:
        message = "Unsupported intent"
    
    return {
        'sessionState': {
            'intent': {
                'name': intent,
            },
            'dialogAction': {
                'type': 'ElicitIntent'
            }
        },
        'messages': [
            {
                'contentType': 'PlainText',
                'content': message
            }
        ]
    }
