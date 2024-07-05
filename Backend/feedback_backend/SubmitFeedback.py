import json
import boto3
import uuid


dynamodb = boto3.client('dynamodb')


TABLE_NAME = 'Feedback'

def lambda_handler(event, context):
    try:
        
        body = json.loads(event['body'])
        
     
        required_fields = ['roomType', 'customerId', 'feedbackText', 'rating']
        if body['roomType'] == 'room':
            required_fields.append('roomId')
        elif body['roomType'] == 'recreation':
            required_fields.append('recreationRoomId')
        
        missing_fields = [field for field in required_fields if field not in body]
        if missing_fields:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': f'Missing fields: {", ".join(missing_fields)}'})
            }
        
 
        feedback_id = str(uuid.uuid4())
        
        item = {
            'feedbackId': {'S': feedback_id},
            'roomType': {'S': body['roomType']},
            'customerId': {'S': body['customerId']},
            'feedbackText': {'S': body['feedbackText']},
            'rating': {'N': str(body['rating'])}
        }
        
        if body['roomType'] == 'room':
            item['roomId'] = {'S': body['roomId']}
        elif body['roomType'] == 'recreation':
            item['recreationRoomId'] = {'S': body['recreationRoomId']}
        
        dynamodb.put_item(TableName=TABLE_NAME, Item=item)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Feedback submitted successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
