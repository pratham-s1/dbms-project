import requests
import json
import time

# List of 10 major cities in India
cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Jaipur", "Udupi", "Dehradun", "Haridwar"]

# API endpoint and headers
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

# Main function to fetch data for all cities and store it in a JSON file
def save_data_to_json():
    all_stations = {}
    for city in cities:
        stations = fetch_station_data(city)
        time.sleep(2)
        print(f"Fetched data for {city}")
        all_stations[city] = stations

    # Save the data to a JSON file
    with open('city.json', 'w') as json_file:
        json.dump(all_stations, json_file, indent=4)

    print("Data has been saved to city.json")

# Run the function
save_data_to_json()
