import json
import boto3
from decimal import Decimal

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Room')

    # Initialize S3 client
    s3_client = boto3.client('s3')
    bucket_name = 'room-images-dal'
    
    try:
        # Scan the table to get all room details
        response = table.scan()
        rooms = response.get('Items', [])

        # Fetch images for each room from S3
        for room in rooms:
            image_urls = []
            room_id = room['room_id']  # Access directly
            s3_folder_path = f'{room_id}/'

            # List objects in the S3 folder
            s3_response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=s3_folder_path)
            if 'Contents' in s3_response:
                for obj in s3_response['Contents']:
                    if obj['Key'] != s3_folder_path:    
                        image_url = s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': obj['Key']})
                        image_urls.append(image_url)
            
            # Add image URLs to room details
            room['images'] = image_urls
        
        return {
            'statusCode': 200,
            'body': json.dumps(rooms, default=decimal_default)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error fetching room details: {str(e)}')
        }
