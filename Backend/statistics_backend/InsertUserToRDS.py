import os
import json
import mysql.connector
from mysql.connector import errorcode

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
            database=rds_db_name,
            connect_timeout=5
        )
        return connection
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("ERROR: Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("ERROR: Database does not exist")
        else:
            print(err)
        raise

def insert_user_to_rds(cursor, user):
    email = user['email']['S']
    firstName = user['firstName']['S']
    lastName = user['lastName']['S']
    userType = user['userType']['S'] if 'userType' in user else 'registered-users'
    is_active = 0

    sql = """
        INSERT INTO users (email, firstName, lastName, userType, is_active)
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            firstName = VALUES(firstName),
            lastName = VALUES(lastName),
            userType = VALUES(userType),
            is_active = VALUES(is_active)
    """
    cursor.execute(sql, (email, firstName, lastName, userType, is_active))

def lambda_handler(event, context):
    connection = connect_to_rds()
    cursor = connection.cursor()

    for record in event['Records']:
        if record['eventName'] == 'INSERT':
            new_user = record['dynamodb']['NewImage']
            insert_user_to_rds(cursor, new_user)

    connection.commit()
    cursor.close()
    connection.close()

    return {
        'statusCode': 200,
        'body': json.dumps('Success')
    }
