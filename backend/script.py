import mysql.connector
import json
import requests

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="rrmp"
)
cursor = conn.cursor()

# API link
api_link = "https://indian-railway-api.cyclic.app/trains/betweenStations/?from=DEC&to=MMCT"

# Fetch data from API
response = requests.get(api_link)
data = response.json()

# Insert data into Train and Schedule tables
for train in data['data']:
    train_base = train['train_base']
    train_name = train_base['train_name']
    source = train_base['source_stn_name']
    destination = train_base['dstn_stn_name']
    start_time = train_base['from_time']
    end_time = train_base['to_time']
    status = 'Scheduled'  # Assuming all trains are scheduled by default
    total_seats = 1000  # Assuming a default value for total seats

    # Insert data into Train table
    train_insert_query = """
    INSERT INTO Train (train_name, source, destination, start_time, end_time, status, total_seats) 
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(train_insert_query, (train_name, source, destination, start_time, end_time, status, total_seats))

    # Get the train_id of the inserted train
    train_id = cursor.lastrowid

    # Insert data into Schedule table
    schedule_insert_query = """
    INSERT INTO Schedule (train_id, station_id, from_station_id, to_station_id, platform, arrival_time, departure_time) 
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    # Assuming station_id, from_station_id, and to_station_id as the station codes
    station_id = train_base['dstn_stn_code']
    from_station_id = train_base['source_stn_code']
    to_station_id = train_base['to_stn_code']
    platform = "Platform 1"  # Assuming a default platform
    arrival_time = train_base['to_time']
    departure_time = train_base['from_time']

    cursor.execute(schedule_insert_query, (train_id, station_id, from_station_id, to_station_id, platform, arrival_time, departure_time))

# Commit changes
conn.commit()

# Close connection
conn.close()
