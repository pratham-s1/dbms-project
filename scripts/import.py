import mysql.connector
from mysql.connector import Error
import json
import os

def connect_to_database(host, user, password, database):
    """ Connect to MySQL database """
    try:
        conn = mysql.connector.connect(host=host, user=user, password=password, database=database)
        if conn.is_connected():
            print("Connected to MySQL database")
            return conn
    except Error as e:
        print(f"Error: {e}")
        return None

def import_data_from_json(conn, json_file, table):
    """ Import data from a JSON file into a MySQL table """
    
    cursor = conn.cursor()
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
        if not data:  # Check if data is empty
            print(f"No data found in {json_file}, skipping...")
            return

        # Dynamically prepare SQL based on JSON keys
        placeholders = ", ".join(["%s"] * len(data[0]))
        columns = ", ".join(data[0].keys())
        sql = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        
        # Prepare data tuple list for batch insertion
        values_to_insert = [tuple(entry.values()) for entry in data]

        try:
            cursor.executemany(sql, values_to_insert)  # Use executemany for batch insertion
            conn.commit()
            print(f"Inserted {cursor.rowcount} rows into {table} from {json_file}")
        except Error as e:
            print(f"Error while inserting data into {table}: {e}")
            conn.rollback()  # Rollback in case of error
    cursor.close()

def main():
    # Database connection parameters
    host = 'localhost'
    user = 'root'
    password = 'root'  # Change to your actual password
    database = 'rrmp'  # Change to your actual database name

    # Connect to the database
    conn = connect_to_database(host, user, password, database)
    if conn:
        # List all JSON files in the current directory
        json_files = [f for f in os.listdir('.') if f.endswith('.json')]
        
        print(json_files)
        # Import data for each JSON file into the corresponding table
        for json_file in json_files:
            table_name = json_file.replace('.json', '')
            
            # drop table if exists
            cursor = conn.cursor()
            cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
            cursor.close()

            import_data_from_json(conn, json_file, table_name)

        # Close the database connection
        conn.close()

if __name__ == "__main__":
    main()
