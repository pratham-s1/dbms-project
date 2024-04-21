import mysql.connector
from mysql.connector import Error
import json

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

def fetch_table_names(conn):
    """ Fetch all table names in the database """
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES;")
    tables = [row[0] for row in cursor.fetchall()]
    cursor.close()
    return tables

def export_tables_to_json(conn, tables):
    """ Export each table to a separate JSON file """
    cursor = conn.cursor(dictionary=True)
    for table in tables:
        cursor.execute(f"SELECT * FROM {table};")
        rows = cursor.fetchall()
        with open(f"{table}.json", 'w', encoding='utf-8') as file:
            json.dump(rows, file, indent=4, default=str)  # Use `default=str` to handle datetime and other non-serializable types
        print(f"Data from {table} has been written to {table}.json")
    cursor.close()

def main():
    # Database connection parameters
    host = 'localhost'
    user = 'root'
    password = 'root'
    database = 'rrmp'

    # Connect to the database
    conn = connect_to_database(host, user, password, database)
    if conn:
        # Fetch table names
        tables = fetch_table_names(conn)

        # Export tables to JSON files
        export_tables_to_json(conn, tables)

        # Close connection
        conn.close()

if __name__ == "__main__":
    main()
