import requests
import mysql.connector
from mysql.connector import Error

# List of 10 major cities in India
cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"]

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
            return conn
    except Error as e:
        print(f"Error: {e}")
        return None

# Function to insert station data into the database
def insert_station_data(data, conn):
    cursor = conn.cursor()
    query = "INSERT INTO Station (station_id, station_name, city) VALUES (%s, %s, %s)"
    try:
        cursor.executemany(query, data)
        conn.commit()
    except Error as e:
        print(f"Failed to insert data: {e}")
    finally:
        cursor.close()

# Main function to fetch station data and store it
def fetch_and_store_station_data():
    url = "https://rstations.p.rapidapi.com/"
    headers = {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "your_api_key_here",
        "X-RapidAPI-Host": "rstations.p.rapidapi.com"
    }
    conn = connect_to_db()
    if conn is None:
        return

    for city in cities:
        payload = {"search": city}
        response = requests.post(url, json=payload, headers=headers)
        stations = response.json()
        
        for station in stations.values():
            print(station[0], station[1], city, station)

            data = [(station[0], station[1], city)]
            insert_station_data(data, conn)
    
    conn.close()

# Run the function
fetch_and_store_station_data()