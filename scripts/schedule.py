import json
import mysql.connector
from mysql.connector import Error
import requests
import datetime

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

# Fetch station codes from the database
def fetch_station_codes(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT station_id FROM Station")
    stations = [row[0] for row in cursor.fetchall()]
    cursor.close()
    return stations

def insert_train_and_schedule_data(train_data, conn):
    cursor = conn.cursor()
    train_insert_query = """
    INSERT INTO Train (train_name, source, destination, start_time, end_time, status, total_seats)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    schedule_insert_query = """
    INSERT INTO Schedule (train_id, station_id, from_station_id, to_station_id, platform, arrival_time, departure_time)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    station_check_query = "SELECT station_id FROM Station WHERE station_id = %s"
    station_insert_query = "INSERT INTO Station (station_id, station_name, city) VALUES (%s, %s, %s)"

    try:
        for train in train_data:
            if ('local' in train.get('train_name', '').lower() 
                or 'fast' in train.get('train_name', '').lower()
                or 'slow' in train.get('train_name', '').lower()
                or 'passenger' in train.get('train_name', '').lower()
                or 'memu' in train.get('train_name', '').lower()
                or 'emu' in train.get('train_name', '').lower()
                or 'dmu' in train.get('train_name', '').lower()
                or 'suburban' in train.get('train_name', '').lower()
                or 'metro' in train.get('train_name', '').lower()                
                ):
                print(f"Skipping local train: {train['train_name']}")
                continue  # Skip if train name contains "local"
            
            source = train.get('source_stn_name', '')
            destination = train.get('dstn_stn_name', '')
            from_station_code = train.get('from_stn_code', '')
            to_station_code = train.get('to_stn_code', '')
            from_time = train.get('from_time', '00.00')
            to_time = train.get('to_time', '00.00')

            # Check and insert missing stations
            for code in [from_station_code, to_station_code]:
                cursor.execute(station_check_query, (code,))
                if cursor.fetchone() is None:
                    print(f"Missing station code: {code}, inserting to Station table.")
                    cursor.execute(station_insert_query, (code, f"{code} Station", "Unknown City"))

            # Insert into Train table
            cursor.execute(train_insert_query, (
                train.get('train_name', ''),
                source,
                destination,
                datetime.datetime.strptime(from_time, "%H.%M").time(),
                datetime.datetime.strptime(to_time, "%H.%M").time(),
                'Scheduled', 0
            ))
            train_id = cursor.lastrowid

            # Insert into Schedule table
            cursor.execute(schedule_insert_query, (
                train_id,
                to_station_code,
                from_station_code,
                to_station_code,
                "", 
                datetime.datetime.strptime(from_time, "%H.%M").time(),
                datetime.datetime.strptime(to_time, "%H.%M").time()
            ))
        conn.commit()
    except Error as e:
        print(f"Failed to insert data: {e}")
    finally:
        cursor.close()

# Function to fetch and process train data for each station pair
def fetch_and_store_train_data(stations, conn):
    api_url = "https://indian-railway-api.cyclic.app/trains/betweenStations/"
    for i in range(len(stations)):
        for j in range(i + 1, len(stations)):
            from_station = stations[i]
            to_station = stations[j]
            response = requests.get(f"{api_url}?from={from_station}&to={to_station}")
            if response.status_code == 200 and response.json().get('success', False):
                train_data = [train['train_base'] for train in response.json().get('data', [])]
                print(f"Fetching data for {from_station} to {to_station}: {len(train_data)} entries found")
                insert_train_and_schedule_data(train_data, conn)

# Main function to manage the database update process
def main():
    conn = connect_to_db()
    if conn is None:
        return
    stations = fetch_station_codes(conn)
    fetch_and_store_train_data(stations, conn)
    conn.close()

# Execute the function
main()


# DELETE FROM Schedule
# WHERE train_id IN (
#     SELECT train_id FROM Train
#     WHERE LOWER(train_name) LIKE '%local%'
# );

# DELETE FROM Train
# WHERE LOWER(train_name) LIKE '%local%';


# DELETE FROM Schedule
# WHERE train_id IN (
#     SELECT train_id FROM Train
#     WHERE LOWER(train_name) LIKE '%fast%'
# );

# DELETE FROM Train
# WHERE LOWER(train_name) LIKE '%fast%';
