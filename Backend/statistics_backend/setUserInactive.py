import os
import json
import mysql.connector
from mysql.connector import Error

rds_host = "user-details.cirqdoltkjgp.us-east-1.rds.amazonaws.com"
rds_username = ""
rds_password = ""
rds_db_name = "userDetails"

def connect_to_rds():
    try:
        connection = mysql.connector.connect(
            host=rds_host,
            user=rds_username,
            password=rds_password,
            database=rds_db_name
        )
        return connection
    except Error as e:
        print(f"ERROR: Could not connect to MySQL instance. {e}")
        raise

def set_user_inactive(cursor, email):
    sql = """
        UPDATE users
        SET is_active = FALSE
        WHERE email = %s
    """
    cursor.execute(sql, (email,))

def lambda_handler(event, context):
    connection = connect_to_rds()
    cursor = connection.cursor()
    print(event)

    body = json.loads(event['body'])
    email = body['email']

    set_user_inactive(cursor, email)

    connection.commit()
    cursor.close()
    connection.close()

    return {
        'statusCode': 200,
        'body': json.dumps('Logout event logged successfully, user set to inactive')
    }
