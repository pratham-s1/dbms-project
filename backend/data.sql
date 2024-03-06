CREATE TABLE Users (
    user_id INT PRIMARY KEY,name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    sex ENUM('M', 'F', 'Other') NOT NULL,
    phone VARCHAR(20),
    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
    );

INSERT INTO Users (user_id, name, email, password, sex, phone, dob, is_admin)
    VALUES
        (1001, 'John Doe', 'john@example.com', 'password123', 'M', '+1234567890', '1990-05-15', FALSE),
        (1002, 'Jane Smith', 'jane@example.com', 'securepass', 'F', '+9876543210', '1985-08-22', FALSE),
        (1003, 'Alex Johnson', 'alex@example.com', 'pass123', 'M', '+1122334455', '1995-11-30', FALSE),
        (1004, 'Emma White', 'emma@example.com', 'mysecretpass', 'F', '+9988776655', '1992-04-10', FALSE),
        (1005, 'Sam Taylor', 'sam@example.com', 'strongpass', 'Other', '+7766554433', '1988-12-05', TRUE);



CREATE TABLE Passenger (
        passenger_id INT  PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        dob DATE,
        sex ENUM('M', 'F', 'Other'),
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );

INSERT INTO Passenger (passenger_id, user_id, name, dob, sex)
    VALUES
        (2001, 1001, 'Passenger 1', '1992-03-20', 'M'),
        (2002, 1002, 'Passenger 2', '1988-07-12', 'F'),
        (2003, 1003, 'Passenger 3', '1995-11-05', 'Other'),
        (2004, 1004, 'Passenger 4', '1990-09-18', 'M'),
        (2005, 1005, 'Passenger 5', '1983-04-25', 'F');


CREATE TABLE Trains (
        train_id INT  PRIMARY KEY,
        train_name VARCHAR(255) NOT NULL,
        start_source VARCHAR(255) NOT NULL,
        end_destination VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('Scheduled', 'Cancelled', 'Delayed') NOT NULL
    );

INSERT INTO Trains (train_id, train_name, start_source, end_destination, date, start_time, end_time, status)
    VALUES
        (3001, 'Express Train 1', 'City A', 'City B', '2024-03-10', '08:00:00', '12:00:00', 'Scheduled'),
        (3002, 'Express Train 2', 'City B', 'City C', '2024-03-11', '10:30:00', '14:30:00', 'Scheduled'),
        (3003, 'Local Train 1', 'City C', 'City D', '2024-03-12', '15:45:00', '18:30:00', 'Scheduled'),
        (3004, 'Express Train 3', 'City D', 'City E', '2024-03-13', '09:15:00', '13:00:00', 'Scheduled'),
        (3005, 'Local Train 2', 'City E', 'City F', '2024-03-14', '13:30:00', '16:45:00', 'Scheduled');


CREATE TABLE Train_Stations (
        station_id INT AUTO_INCREMENT PRIMARY KEY,
        train_id INT NOT NULL,
        station_name VARCHAR(255) NOT NULL,
        platform VARCHAR(20) NOT NULL,
        arrival_time TIME,
        departure_time TIME,
        source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        status ENUM('Active', 'Inactive'),
        FOREIGN KEY (train_id) REFERENCES Trains(train_id)
    );

INSERT INTO Train_Stations (station_id, train_id, station_name, platform, arrival_time, departure_time, source, destination, status)
    VALUES
        (7001, 3001, 'Station A', 'Platform 1', '08:00:00', '08:15:00', 'City A', 'City B', 'Active'),
        (7002, 3002, 'Station B', 'Platform 2', '10:30:00', '10:45:00', 'City B', 'City C', 'Active'),
        (7003, 3003, 'Station C', 'Platform 3', '15:45:00', '16:00:00', 'City C', 'City D', 'Active'),
        (7004, 3004, 'Station D', 'Platform 4', '09:15:00', '09:30:00', 'City D', 'City E', 'Active'),
        (7005, 3005, 'Station E', 'Platform 5', '13:30:00', '13:45:00', 'City E', 'City F', 'Active');


CREATE TABLE Train_Coaches (
        coach_id INT AUTO_INCREMENT PRIMARY KEY,
        train_id INT NOT NULL,
        total_seats INT NOT NULL,
        available_seats INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('Available', 'Full'),
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (train_id) REFERENCES Trains(train_id)
    );

NSERT INTO Train_Coaches (coach_id, train_id, total_seats, available_seats, status, price)
    VALUES
        (4001, 3001, 50, 50, 'Available', 30.00),
        (4002, 3002, 40, 40, 'Available', 35.00),
        (4003, 3003, 60, 60, 'Available', 25.00),
        (4004, 3004, 45, 45, 'Available', 40.00),
        (4005, 3005, 55, 55, 'Available', 28.00);



CREATE TABLE Tickets (
        ticket_id INT  PRIMARY KEY,
        passenger_id INT NOT NULL,
        train_id INT NOT NULL,
        coach_id INT NOT NULL,
        seat_id INT NOT NULL,
        food_preference ENUM('Veg', 'Non-Veg', 'Vegan') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_cancelled BOOLEAN DEFAULT FALSE,
        status ENUM('Confirmed', 'Cancelled', 'Pending'),
        FOREIGN KEY (passenger_id) REFERENCES Passenger(passenger_id),
        FOREIGN KEY (train_id) REFERENCES Trains(train_id),
        FOREIGN KEY (coach_id) REFERENCES Train_Coaches(coach_id)
    );


INSERT INTO Tickets (ticket_id, passenger_id, train_id, coach_id, seat_id, food_preference, status)
    VALUES
        (5001, 2001, 3001, 4001, 1, 'Veg', 'Confirmed'),
        (5002, 2002, 3002, 4002, 2, 'Non-Veg', 'Confirmed'),
        (5003, 2003, 3003, 4003, 3, 'Vegan', 'Pending'),
        (5004, 2004, 3004, 4004, 4, 'Non-Veg', 'Confirmed'),
        (5005, 2005, 3005, 4005, 5, 'Veg', 'Confirmed');


CREATE TABLE Payment (
        payment_id INT  PRIMARY KEY,
        ticket_id INT NOT NULL,
        user_id INT NOT NULL,
        coach_id INT NOT NULL,
        train_id INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        status ENUM('Paid', 'Pending', 'Refunded'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id),
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (coach_id) REFERENCES Train_Coaches(coach_id),
        FOREIGN KEY (train_id) REFERENCES Trains(train_id)
    );


INSERT INTO Payment (payment_id, ticket_id, user_id, coach_id, train_id, price, status)
    VALUES
        (6001, 5001, 1001, 4001, 3001, 30.00, 'Paid'),
        (6002, 5002, 1002, 4002, 3002, 35.00, 'Paid'),
        (6003, 5003, 1003, 4003, 3003, 25.00, 'Pending'),
        (6004, 5004, 1004, 4004, 3004, 40.00, 'Paid'),
        (6005, 5005, 1005, 4005, 3005, 28.00, 'Paid');
