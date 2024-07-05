import json
import boto3
import uuid

def lambda_handler(event, context):
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Room')
    
    # Generate a unique room_id
    room_id = str(uuid.uuid4())
    
    # Extract input parameters from the event
    about = event.get('about')
    booked_dates = event.get('booked_dates', [])
    facilities = event.get('facilities', [])
    max_guests = event.get('max_guests')
    no_of_baths = event.get('no_of_baths')
    no_of_beds = event.get('no_of_beds')
    price = event.get('price')
    room_name = event.get('room_name')
    room_type = event.get('room_type')
    
    # Validate the inputs
    if not all([about, max_guests, no_of_baths, no_of_beds, price, room_name, room_type]):
        return {
            'statusCode': 400,
            'body': json.dumps('Missing required fields')
        }
    
    # Prepare the item to be inserted
    item = {
        'room_id': room_id,
        'about': about,
        'booked_dates': booked_dates,
        'facilities': facilities,
        'max_guests': max_guests,
        'no_of_baths': no_of_baths,
        'no_of_beds': no_of_beds,
        'price': price,
        'room_name': room_name,
        'room_type': room_type,
    }
    
    # Insert the item into the DynamoDB table
    try:
        table.put_item(Item=item)
        return {
            'statusCode': 200,
            'body': json.dumps('Room added successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error adding room: {str(e)}')
        }

