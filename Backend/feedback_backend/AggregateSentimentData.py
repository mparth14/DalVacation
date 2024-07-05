import json
import boto3
from decimal import Decimal

 
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Feedback')

def calculate_overall_sentiment(score, magnitude):
    if score > 0.25:
        return "Clearly Positive"
    elif score < -0.25:
        return "Clearly Negative"
    elif score == 0 and magnitude == 0:
        return "Neutral"
    else:
        return "Mixed"

def aggregate_sentiments(feedbacks):
    room_data = {}
    print("hello")
    print(feedbacks)
    for feedback in feedbacks:
        room_id = feedback.get('roomId') or feedback.get('recreationRoomId')
        if not room_id:
            continue
        
        score = feedback.get('sentimentScore', Decimal(0))
        magnitude = feedback.get('sentimentMagnitude', Decimal(0))
        
        if room_id not in room_data:
            room_data[room_id] = {
                'total_score': Decimal(0),
                'total_magnitude': Decimal(0),
                'count': 0,
                'feedbacks': []
            }
        
        room_data[room_id]['total_score'] += score
        room_data[room_id]['total_magnitude'] += magnitude
        room_data[room_id]['count'] += 1
        room_data[room_id]['feedbacks'].append(feedback)
    
    for room_id, data in room_data.items():
        avg_score = data['total_score'] / data['count'] if data['count'] > 0 else Decimal(0)
        avg_magnitude = data['total_magnitude'] / data['count'] if data['count'] > 0 else Decimal(0)
        overall_sentiment = calculate_overall_sentiment(avg_score, avg_magnitude)
        
        room_data[room_id]['average_score'] = avg_score
        room_data[room_id]['average_magnitude'] = avg_magnitude
        room_data[room_id]['overall_sentiment'] = overall_sentiment
    
    return room_data

def lambda_handler(event, context):
     
    response = table.scan()
    feedbacks = response['Items']
    
     
    aggregated_data = aggregate_sentiments(feedbacks)
    
    print(aggregated_data)
    
     
    result = {
        'statusCode': 200,
        'body': json.dumps(aggregated_data, default=str)
    }
    
    return result
