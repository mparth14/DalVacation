import os
import json
import mysql.connector
from mysql.connector import Error
from datetime import datetime

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

def log_user_login(cursor, email):
    login_date = datetime.now().strftime('%Y-%m-%d')
    login_time = datetime.now().strftime('%H:%M:%S')

    sql = """
        INSERT INTO logs (email, login_date, login_time)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (email, login_date, login_time))

def set_user_active(cursor, email):
    sql = """
        UPDATE users
        SET is_active = TRUE
        WHERE email = %s
    """
    cursor.execute(sql, (email,))

def lambda_handler(event, context):
    connection = connect_to_rds()
    cursor = connection.cursor()
    print(event)

    #email = event['email']
    body = json.loads(event['body'])
    email = body['email']
    log_user_login(cursor, email)
    set_user_active(cursor, email)

    connection.commit()
    cursor.close()
    connection.close()

    return {
        'statusCode': 200,
        'body': json.dumps('Login event logged successfully')
    }
