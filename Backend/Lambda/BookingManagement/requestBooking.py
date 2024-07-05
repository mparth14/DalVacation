import boto3
import json
import uuid
from datetime import datetime

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = 'Booking'
table = dynamodb.Table(table_name)


# Initialize SQS client
sqs = boto3.client('sqs')
sqs_queue_url = 'https://sqs.us-east-1.amazonaws.com/705544929821/BookingQueue'

def lambda_handler(event, context):
    try:
        if 'body' in event:
            event_body = json.loads(event['body'])
        else:
            # Handle event from other sources
            event_body = event
    except (KeyError, json.JSONDecodeError) as e:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid input data format')
        }

    email = event_body.get('email')
    room_id = event_body.get('room_id')
    check_in_date = event_body.get('check_in_date')
    check_out_date = event_body.get('check_out_date')
    
    # basic Validation
    if not email or not room_id or not check_in_date or not check_out_date:
        return {
            'statusCode': 400,
            'body': json.dumps('Missing required fields: email, room_id, check_in_date, check_out_date')

        }
    
    # Generating a unique booking request ID
    booking_id = str(uuid.uuid4())
    
    # Format dates
    check_in_iso = datetime.strptime(check_in_date, '%Y-%m-%d').strftime('%Y-%m-%d')
    check_out_iso = datetime.strptime(check_out_date, '%Y-%m-%d').strftime('%Y-%m-%d')
    
    
    request_item = {
        'booking_id': booking_id,
        'email': email,
        'room_id': room_id,
        'check_in_date': check_in_iso,
        'check_out_date': check_out_iso,
        'status': 'pending'  # Initial status when request is created
    }
    
    try:
        # Insert booking request into DynamoDB
        table.put_item(Item=request_item)


        # add to queue
        sqs_message = {
            'booking_id': booking_id, 
            'email' : email
        }
        sqs.send_message(
            QueueUrl=sqs_queue_url,
            MessageBody=json.dumps(sqs_message)
        )
        
        # Return success response
        return {
            'statusCode': 200,
            'body': json.dumps({'message':'Room booking request submitted successfully', 'booking_id': booking_id})
        }
    except Exception as e:
        # Return error response
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }


