import json
import mysql.connector
from mysql.connector import Error

# MySQL database connection details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'rrmp'
}

# Function to connect to MySQL database
def connect_to_db():
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            print("Successfully connected to the database")
            return conn
    except Error as e:
        print(f"Error: {e}")
        return None

# Function to insert station data into the database
def insert_station_data(data, conn):
    cursor = conn.cursor()
    query = """
    INSERT INTO Station (station_id, station_name, city)
    VALUES (%s, %s, %s)
    ON DUPLICATE KEY UPDATE station_name=VALUES(station_name), city=VALUES(city)
    """
    try:
        cursor.executemany(query, data)
        conn.commit()
        print(f"Inserted {cursor.rowcount} rows")
    except Error as e:
        print(f"Failed to insert data: {e}")
    finally:
        cursor.close()

# Function to read JSON data and prepare for database insertion
def load_and_process_data():
    # Open and load the JSON file
    with open('city.json', 'r') as file:
        data = json.load(file)

    # Process the JSON data into a tuple list for MySQL insertion
    insert_data = []
    for city, info in data.items():
        if info['status']:
            for station in info['data']:
                insert_data.append((station['code'], station['name'], city))

    # Connect to the database and insert data
    conn = connect_to_db()
    if conn:
        insert_station_data(insert_data, conn)
        conn.close()

# Execute the function
load_and_process_data()
