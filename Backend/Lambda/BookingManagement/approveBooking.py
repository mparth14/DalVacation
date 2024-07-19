import boto3
import json
from datetime import datetime, timedelta

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
booking_table_name = 'Booking'
booking_table = dynamodb.Table(booking_table_name)

user_table_name = 'User'
user_table = dynamodb.Table(user_table_name)

room_table_name = "Room"
room_table = dynamodb.Table(room_table_name)

# Initialize SNS client
sns = boto3.client('sns')
sns_topic_arn = ""

def lambda_handler(event, context):

    try:

        room_available = True 

        sqs_record = event['Records'][0]
        body = json.loads(sqs_record['body'])

        # Parse input data from API Gateway or other sources
        booking_id = body.get('booking_id')
        email = body.get('email')

        # Fetch the booking request from DynamoDB booking_table
        booking_detail = booking_table.get_item(Key={'booking_id': booking_id})
        request_item = booking_detail.get('Item')
        
        # Check if booking request is present
        if not request_item:
            return {
                'statusCode': 404,
                'body': json.dumps('Booking request not found')
            }
        
        # Check if the request is already confirmed or denied
        if request_item['status'] != 'pending':
            return {
                'statusCode': 400,
                'body': json.dumps('Booking request has already been processed')
            }

        # Get the user details from "User" table using the email
        user_detail = user_table.get_item(Key={'email': email})
        user_item = user_detail.get('Item')

        # Check if user is present
        if not user_item:
            return {
                'statusCode': 404,
                'body': json.dumps('User not found')
            }

        # Get the user SNS arn from the user details. assign it to sns_topic_arn
        sns_topic_arn = user_item.get('topicArn')

        room_id = request_item['room_id']

        # Get the room details from the "Room" table using the room_id
        room_detail = room_table.get_item(Key={'room_id': room_id})
        room_item = room_detail.get('Item')

        # Check if room is present
        if not room_item:
            return {
                'statusCode': 404,
                'body': json.dumps('Room not found')
            }


        # Get check_in_date and check_out_date
        check_in_date = datetime.strptime(request_item['check_in_date'], '%Y-%m-%d')
        check_out_date = datetime.strptime(request_item['check_out_date'], '%Y-%m-%d')
        
        # fetch the booked_dates from room details
        booked_dates = room_item.get('booked_dates', [])
        
        # Check if the dates between the check_in_date and check_out_date are already booked. if yes, then room_available = False 
        for booked_date in booked_dates:
            booked_date = datetime.strptime(booked_date, '%Y-%m-%d')
            if check_in_date <= booked_date <= check_out_date:
                room_available = False
                break

        if room_available:
            # Update status to successful
            booking_table.update_item(
                Key={'booking_id': booking_id},
                UpdateExpression='SET #status = :status',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':status': 'confirmed'}
            )
            message_status = 'confirmed'
            
            # send email to user
            sns_message = f"Your booking was successful. The room is reserved from {request_item['check_in_date']} to {request_item['check_out_date']}. Enjoy your stay."
            sns.publish(
                TopicArn=sns_topic_arn,
                Message=sns_message,
                Subject='Room Booking Confirmation'
            )

            # Update the room details to add the booked dates
            new_booked_dates = []
            current_date = check_in_date
            while current_date <= check_out_date:
                new_booked_dates.append(current_date.strftime('%Y-%m-%d'))
                current_date += timedelta(days=1)

            room_item['booked_dates'].extend(new_booked_dates)
            room_table.update_item(
                Key={'room_id': room_id},
                UpdateExpression='SET booked_dates = :booked_dates',
                ExpressionAttributeValues={':booked_dates': room_item['booked_dates']}
            )

        else:
            # Update status to denied
            booking_table.update_item(
                Key={'booking_id': booking_id},
                UpdateExpression='SET #status = :status',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':status': 'denied'}
            )

            message_status = 'denied'

            # send email to user
            sns_message = f"Your room booking was unsuccessful. The room is already taken. We are sorry for your inconvenience."
            sns.publish(
                TopicArn=sns_topic_arn,
                Message=sns_message,
                Subject='Room Booking Unsuccessful'
            )

        # return success
        return {
            'statusCode': 200,
            'body': json.dumps(f'Booking request {message_status} and notifications sent')
        }

    except Exception as e:
        # Return error response
        booking_table.update_item(
            Key={'booking_id': booking_id},
            UpdateExpression='SET #status = :status',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={':status': 'denied'}
        )

        message_status = 'denied'

        # send email to user
        sns_message = f"Your room booking was unsuccessful. The room is already taken. We are sorry for your inconvenience."
        sns.publish(
            TopicArn=sns_topic_arn,
            Message=sns_message,
            Subject='Room Booking Unsuccessful'
        )

        return {
            'statusCode': 200,
            'body': json.dumps(f'Booking request {message_status} and notifications sent')
        }


