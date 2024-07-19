import json
import boto3

def lambda_handler(event, context):
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Room')
    
    # Extract input parameters from the event
    room_id = event.get('room_id')
    about = event.get('about')
    booked_dates = event.get('booked_dates')
    facilities = event.get('facilities')
    max_guests = event.get('max_guests')
    no_of_baths = event.get('no_of_baths')
    no_of_beds = event.get('no_of_beds')
    price = event.get('price')
    room_name = event.get('room_name')
    room_type = event.get('room_type')
    
    # Validate the inputs
    if not room_id:
        return {
            'statusCode': 400,
            'body': json.dumps('room_id is required')
        }

    update_expression = 'SET '
    expression_attribute_values = {}
    if about:
        update_expression += 'about = :about, '
        expression_attribute_values[':about'] = about
    if booked_dates:
        update_expression += 'booked_dates = :booked_dates, '
        expression_attribute_values[':booked_dates'] = booked_dates
    if facilities:
        update_expression += 'facilities = :facilities, '
        expression_attribute_values[':facilities'] = facilities
    if max_guests:
        update_expression += 'max_guests = :max_guests, '
        expression_attribute_values[':max_guests'] = max_guests
    if no_of_baths:
        update_expression += 'no_of_baths = :no_of_baths, '
        expression_attribute_values[':no_of_baths'] = no_of_baths
    if no_of_beds:
        update_expression += 'no_of_beds = :no_of_beds, '
        expression_attribute_values[':no_of_beds'] = no_of_beds
    if price:
        update_expression += 'price = :price, '
        expression_attribute_values[':price'] = price
    if room_name:
        update_expression += 'room_name = :room_name, '
        expression_attribute_values[':room_name'] = room_name
    if room_type:
        update_expression += 'room_type = :room_type, '
        expression_attribute_values[':room_type'] = room_type

    # Remove trailing comma and space
    update_expression = update_expression.rstrip(', ')

    # Update the item in the DynamoDB table
    try:
        table.update_item(
            Key={'room_id': room_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )
        return {
            'statusCode': 200,
            'body': json.dumps('Room updated successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error updating room: {str(e)}')
        }

