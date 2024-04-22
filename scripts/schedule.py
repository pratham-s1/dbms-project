import mysql.connector
from mysql.connector import Error
import requests
import datetime
import random

url = "https://irctc1.p.rapidapi.com/api/v1/searchStation"
headers = {
    "X-RapidAPI-Key": "ae3a794a55msh31f3fceba9d4407p105a89jsna2bfb3163f3b",
    "X-RapidAPI-Host": "irctc1.p.rapidapi.com"
}

# Function to fetch station data for a city
def fetch_station_data(city):
    querystring = {"query": city}
    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data for {city}: Status code {response.status_code}")
        return {}

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

def insert_station_if_missing(station_id, station_name, conn):
    cursor = conn.cursor()
    check_query = "SELECT station_id FROM Station WHERE station_id = %s"
    insert_query = "INSERT INTO Station (station_id, station_name, city) VALUES (%s, %s, %s)"
    cursor.execute(check_query, (station_id,))
    if cursor.fetchone() is None:
        cursor.execute(insert_query, (station_id, station_name, station_name))
        conn.commit()
        
        print(f"Inserted missing station: {station_name} ({station_id})")


    cursor.close()

def insert_train_and_schedule_data(train_data, conn):
    cursor = conn.cursor()
    train_insert_query = """
    INSERT INTO Train (train_id, train_name, source_id, destination_id, start_time, end_time, status, total_seats)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    schedule_insert_query = """
    INSERT INTO Schedule (train_id, station_id, from_station_id, to_station_id, platform, arrival_time, departure_time)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    try:
        for train in train_data:
            if any(keyword in train.get('train_name', '').lower() for keyword in
                   ['local', 'fast', 'slow', 'passenger', 'memu', 'emu', 'dmu', 'suburban', 'metro', 'ladies']):
                print(f"Skipping local train: {train['train_name']}")
                continue
            
            source_station_name = train.get('source_stn_name', '')
            source_id = train.get('source_stn_code', '')
            
            from_station_name = train.get('from_stn_name', '')
            from_id = train.get('from_stn_code', '')
            
            destination_station_name = train.get('dstn_stn_name', '')
            destination_id = train.get('dstn_stn_code', '')
            
            from_time = train.get('from_time', '00.00')
            to_time = train.get('to_time', '00.00')
            train_id = int(train.get('train_no', ''))

            # Ensure both stations exist, insert if missing
            insert_station_if_missing(source_id, source_station_name, conn)
            insert_station_if_missing(from_id, from_station_name, conn)
            insert_station_if_missing(destination_id, destination_station_name, conn)

            try:
                # Insert into Train table
                cursor.execute(train_insert_query, (
                    train_id,
                    train.get('train_name', ''),
                    source_id,
                    destination_id,
                    datetime.datetime.strptime(from_time, "%H.%M").time(),
                    datetime.datetime.strptime(to_time, "%H.%M").time(),
                    'Scheduled', 
                    200 + int(train_id) % 500
                ))
            except Error as e:
                print(f"Failed to insert train: {e}")
            
            # platform can be any number between 1 to 12
            platform = random.randint(1, 12)
            
            # Insert into Schedule table
            cursor.execute(schedule_insert_query, (
                train_id,
                from_id,
                source_id,
                destination_id,
                platform,
                datetime.datetime.strptime(from_time, "%H.%M").time(),
                datetime.datetime.strptime(to_time, "%H.%M").time()
            ))
            
        conn.commit()
    except Error as e:
        print(f"Failed to insert data: {e}")
    finally:
        cursor.close()

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

def main():
    conn = connect_to_db()
    if conn is None:
        return 
    stations = fetch_station_codes(conn)
    fetch_and_store_train_data(stations, conn)
    conn.close()

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
