CREATE TABLE
    Passenger (
        passenger_id INT NOT NULL AUTO_INCREMENT,
        passenger_name VARCHAR(255),
        passenger_email VARCHAR(255),
        passenger_sex ENUM ('Male', 'Female', 'Other'),
        passenger_phone VARCHAR(20),
        passenger_dob DATE,
        password VARCHAR(255),
        PRIMARY KEY (passenger_id)
    );

CREATE TABLE
    Traveller (
        traveller_id INT NOT NULL AUTO_INCREMENT,
        traveller_name VARCHAR(255),
        traveller_email VARCHAR(255),
        traveller_phone VARCHAR(20),
        traveller_age INT,
        passenger_id INT,
        PRIMARY KEY (traveller_id, passenger_id),
        FOREIGN KEY (passenger_id) REFERENCES Passenger (passenger_id)
    );

CREATE TABLE
    Station (
        station_id VARCHAR(20) PRIMARY KEY,
        station_name VARCHAR(255),
        city VARCHAR(255)
    );

CREATE TABLE
    Train (
        train_id INT PRIMARY KEY AUTO_INCREMENT,
        train_name VARCHAR(255),
        source_id VARCHAR(255),
        destination_id VARCHAR(255),
        start_time TIME,
        end_time TIME,
        status ENUM ('Scheduled', 'Delayed', 'Cancelled', 'Completed'),
        FOREIGN KEY (source_id) REFERENCES Station (station_id),
        FOREIGN KEY (destination_id) REFERENCES Station (station_id),
        total_seats INT
    );


CREATE TABLE
    Schedule (
        train_id INT NOT NULL,
        station_id VARCHAR(20) NOT NULL,
        from_station_id VARCHAR(20),
        to_station_id VARCHAR(20),
        platform VARCHAR(50),
        arrival_time TIME,
        departure_time TIME,
        PRIMARY KEY (train_id, station_id, from_station_id, to_station_id),
        FOREIGN KEY (train_id) REFERENCES Train (train_id),
        FOREIGN KEY (station_id) REFERENCES Station (station_id)
    );


CREATE TABLE
    Payment (
        payment_id VARCHAR(40) PRIMARY KEY NOT NULL,
        status ENUM ('Pending', 'Completed', 'Failed'),
        price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    Seat (
        seat_id INT PRIMARY KEY AUTO_INCREMENT,
        train_id INT,
        type VARCHAR(50),
        price DECIMAL(10, 2),
        FOREIGN KEY (train_id) REFERENCES Train (train_id)
    );

CREATE TABLE
    Ticket (
        ticket_id INT PRIMARY KEY AUTO_INCREMENT,
        passenger_id INT,
        payment_id VARCHAR(40),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM ('Pending', 'Confirmed', 'Cancelled'),
        FOREIGN KEY (passenger_id) REFERENCES Passenger (passenger_id),
        FOREIGN KEY (payment_id) REFERENCES Payment (payment_id)
    );


CREATE TABLE
    TravellerTickets (
        ticket_id INT,
        traveller_id INT,
        seat_id INT,
        food_preference VARCHAR(40),
        PRIMARY KEY (ticket_id, traveller_id),
        FOREIGN KEY (ticket_id) REFERENCES Ticket (ticket_id),
        FOREIGN KEY (traveller_id) REFERENCES Traveller (traveller_id),
        FOREIGN KEY (seat_id) REFERENCES Seat (seat_id)
    );

CREATE TABLE
    Admin (
        admin_id INT PRIMARY KEY AUTO_INCREMENT,
        admin_name VARCHAR(255),
        admin_email VARCHAR(255),
        admin_password VARCHAR(255)
    );

INSERT INTO
    User (
        user_id,
        user_name,
        user_email,
        user_password,
        user_sex,
        user_phone,
        user_dob
    )
VALUES
    (
        1001,
        'Akash Sharma',
        'akash.sharma@gmail.com',
        'password123',
        'Male',
        '9876543210',
        '1990-05-15'
    ),
    (
        1002,
        'Priya Patel',
        'priya.patel@gmail.com',
        'securepass',
        'Female',
        '8765432109',
        '1988-09-20'
    ),
    (
        1003,
        'Rahul Singh',
        'rahul.singh@gmail.com',
        'strongpwd',
        'Male',
        '7654321098',
        '1995-12-10'
    ),
    (
        1004,
        'Neha Gupta',
        'neha.gupta@gmail.com',
        'password321',
        'Female',
        '6543210987',
        '1992-03-25'
    ),
    (
        1005,
        'Anjali Khanna',
        'anjali.khanna@gmail.com',
        'password456',
        'Female',
        '5432109876',
        '1987-07-18'
    ),
    (
        1006,
        'Vikram Joshi',
        'vikram.joshi@gmail.com',
        'newpass123',
        'Male',
        '4321098765',
        '1991-10-30'
    ),
    (
        1007,
        'Deepika Sharma',
        'deepika.sharma@gmail.com',
        'secretpass123',
        'Female',
        '3210987654',
        '1986-02-08'
    );

INSERT INTO
    Train (
        train_id,
        train_name,
        source,
        destination,
        start_time,
        end_time,
        status,
        total_seats
    )
VALUES
    (
        1,
        'Rajdhani Express',
        'New Delhi',
        'Mumbai',
        '09:00:00',
        '18:00:00',
        'Scheduled',
        300
    ),
    (
        2,
        'Shatabdi Express',
        'Kolkata',
        'Chennai',
        '08:30:00',
        '17:30:00',
        'Scheduled',
        250
    ),
    (
        3,
        'Duronto Express',
        'Mumbai',
        'Pune',
        '10:00:00',
        '12:00:00',
        'Scheduled',
        200
    ),
    (
        4,
        'Garib Rath Express',
        'Jaipur',
        'Ahmedabad',
        '07:00:00',
        '14:00:00',
        'Scheduled',
        350
    ),
    (
        5,
        'Rajdhani Express',
        'Mumbai',
        'Delhi',
        '10:30:00',
        '19:30:00',
        'Scheduled',
        320
    );

INSERT INTO
    Payment (payment_id, status, price)
VALUES
    (5501, 'Pending', 25.00),
    (5502, 'Completed', 50.50),
    (5503, 'Failed', 30.25),
    (5504, 'Completed', 45.75),
    (5505, 'Pending', 20.00);

INSERT INTO
    Seat (seat_id, train_id, type, price)
VALUES
    (101, 1, 'AC', 100.00),
    (202, 2, 'AC', 120.00),
    (303, 3, 'NAC', 80.00),
    (404, 4, 'NAC', 90.00),
    (505, 5, 'AC', 110.00);

INSERT INTO
    Ticket (
        ticket_id,
        user_id,
        payment_id,
        seat_id,
        food_preference,
        status
    )
VALUES
    (00001, 1001, 5501, 101, 'Vegetarian', 'Confirmed'),
    (
        00002,
        1002,
        5502,
        202,
        'Non-Vegetarian',
        'Confirmed'
    ),
    (00003, 1003, 5503, 303, 'Vegetarian', 'Pending'),
    (
        00004,
        1004,
        5504,
        404,
        'Non-Vegetarian',
        'Confirmed'
    ),
    (00005, 1005, 5505, 505, 'Vegetarian', 'Cancelled');

INSERT INTO
    Station (station_id, station_name, city)
VALUES
    ('S1', 'New Delhi Railway Station', 'New Delhi'),
    ('S2', 'Howrah Junction', 'Kolkata'),
    ('S3', 'Mumbai Central', 'Mumbai'),
    ('S4', 'Chennai Central', 'Chennai'),
    ('S5', 'Pune Junction', 'Pune'),
    ('S6', 'Jaipur Junction', 'Jaipur'),
    ('S7', 'Ahmedabad Junction', 'Ahmedabad'),
    ('S8', 'Hyderabad Deccan', 'Hyderabad');

INSERT INTO
    Schedule (
        train_id,
        station_id,
        platform,
        arrival_time,
        departure_time
    )
VALUES
    (1, 'S1', 'Platform 1', '09:00:00', '09:10:00'),
    (1, 'S2', 'Platform 2', '12:30:00', '12:40:00'),
    (1, 'S3', 'Platform 3', '16:00:00', '16:10:00'),
    (2, 'S2', 'Platform 1', '08:00:00', '08:10:00'),
    (2, 'S4', 'Platform 2', '11:30:00', '11:40:00');

INSERT INTO
    Passenger (
        user_id,
        passenger_id,
        passenger_name,
        passenger_email,
        passenger_sex,
        passenger_phone,
        passenger_dob
    )
VALUES
    (
        1001,
        2001,
        'Ramesh Kumar',
        'ramesh.kumar@gmail.com',
        'Male',
        '+91 9876543210',
        '1985-08-15'
    ),
    (
        1001,
        2002,
        'Sunita Devi',
        'sunita.devi@gmail.com',
        'Female',
        '+91 8765432109',
        '1990-09-20'
    ),
    (
        1002,
        2003,
        'Amit Singh',
        'amit.singh@gmail.com',
        'Male',
        '+91 7654321098',
        '1988-04-10'
    ),
    (
        1003,
        2004,
        'Priya Sharma',
        'priya.sharma@gmail.com',
        'Female',
        '+91 6543210987',
        '1992-03-25'
    ),
    (
        1004,
        2005,
        'Deepak Patel',
        'deepak.patel@gmail.com',
        'Male',
        '+91 5432109876',
        '1987-07-18'
    ),
    (
        1005,
        2006,
        'Neha Gupta',
        'neha.gupta@gmail.com',
        'Female',
        '+91 4321098765',
        '1991-10-30'
    ),
    (
        1006,
        2007,
        'Vikas Verma',
        'vikas.verma@gmail.com',
        'Male',
        '+91 3210987654',
        '1986-02-08'
    ),
    (
        1006,
        2008,
        'Ritu Singh',
        'ritu.singh@gmail.com',
        'Female',
        '+91 2109876543',
        '1995-12-10'
    );