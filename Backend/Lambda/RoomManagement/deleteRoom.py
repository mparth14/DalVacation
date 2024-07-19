import json
import boto3

def lambda_handler(event, context):
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Room')
    
    # Extract the room_id from the event
    room_id = event.get('room_id')
    
    # Validate the input
    if not room_id:
        return {
            'statusCode': 400,
            'body': json.dumps('room_id is required')
        }
    
    # Delete the item from the DynamoDB table
    try:
        table.delete_item(Key={'room_id': room_id})
        return {
            'statusCode': 200,
            'body': json.dumps('Room deleted successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error deleting room: {str(e)}')
        }

