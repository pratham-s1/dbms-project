import express from "express";
import mysql from "mysql2/promise";
import "dotenv/config";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import axios from "axios";

import Razorpay from "razorpay";
import { nanoid } from "nanoid";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET; // You should define this in your .env file

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add this line

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "https://rrmpdbms.vercel.app",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:8080",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 3600,
    exposedHeaders: ["Content-Length", "X-Request-Id"],
  })
);

let connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST ?? "localhost",
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT ?? 3306,
});

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (token == null) return res.sendStatus(401); // if there's no token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if the token has expired or is invalid
    user.isAdmin = user.isAdmin ?? false;
    req.user = user;
    next();
  });
}

app.get("/", async (req, res) => {
  const [results, fields] = await connection.query("SHOW TABLES;");

  return res.status(200).json({ results });
});

app.post("/register", async (req, res) => {
  try {
    const {
      passenger_name,
      passenger_email,
      passenger_dob,
      passenger_phone,
      passenger_sex,
      password,
    } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const dobDate = new Date(passenger_dob);
    if (dobDate > new Date()) {
      return res
        .status(400)
        .json({ error: "Date of birth should not be greater than today" });
    }

    const month = dobDate.getMonth() + 1;
    const year = dobDate.getFullYear();
    const date = dobDate.getDate();

    // Inserting the passenger details into the database
    const query = `INSERT INTO Passenger(passenger_name, passenger_email, passenger_sex, passenger_phone, passenger_dob, password) VALUES('${passenger_name}', '${passenger_email}', '${passenger_sex}', '${passenger_phone}', '${year}-${month}-${date}', '${hashedPassword}');`;
    const [results, fields] = await connection.query(query);

    return res
      .status(200)
      .json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred during registration" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { passenger_email, password } = req.body;
    const query = `SELECT passenger_name, passenger_email, passenger_id, password FROM Passenger WHERE passenger_email = '${passenger_email}' LIMIT 1;`;
    const [results, fields] = await connection.query(query);
    console.log(results);
    if (results.length > 0) {
      const passenger = results[0];
      const isMatch = await bcrypt.compare(password, passenger.password);

      if (isMatch) {
        // Create JWT token
        const token = jwt.sign(
          { email: passenger_email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        // Store JWT in a secure cookie
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "Strict",
          secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
          success: true,
          message: "Login successful",
          data: {
            passenger_name: passenger.passenger_name,
            passenger_email: passenger.passenger_email,
            passenger_id: passenger.passenger_id,
            passenger_dob: passenger.passenger_dob,
          },
        });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(404).json({ error: "Passenger not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

app.post("/adminlogin", async (req, res) => {
  try {
    const { admin_email, password } = req.body;
    const query = `SELECT * FROM Admin WHERE admin_email = '${admin_email}' LIMIT 1;`;
    const [results, fields] = await connection.query(query);

    if (results.length > 0) {
      const admin = results[0];

      const isMatch = password === admin.password;

      if (isMatch) {
        // Create JWT token
        const token = jwt.sign(
          { email: admin_email, isAdmin: true },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );

        // Store JWT in a secure cookie
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "Strict",
          secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
          success: true,
          message: "Login successful",
          data: {
            admin_name: admin.admin_name,
            admin_email: admin.admin_email,
            admin_id: admin.admin_id,
          },
        });
      }

      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Admin not found");
    return res.status(404).json({ error: "Admin not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

app.get("/revenue", authenticateToken, async (req, res) => {
  try {
    const query = `SELECT 
   *
FROM
    Payment
WHERE
    status = 'Completed';`;

    const [results] = await connection.execute(query);

    // query to get total revenue
    const totalRevenueQuery = `SELECT SUM(price) as total_revenue FROM Payment WHERE status = 'Completed';`;

    const [revenueResults] = await connection.execute(totalRevenueQuery);

    const totalRevenue = revenueResults[0].total_revenue;

    return res.status(200).json({
      results,
      totalRevenue,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "An error occurred during the revenue fetching process",
    });
  }
});

app.post("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logged out" });
});

app.get("/status", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({
        user: null,
        message: "User not logged in",
        success: false,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const query = `SELECT passenger_name, passenger_email, passenger_id FROM Passenger WHERE passenger_email = '${decoded.email}' LIMIT 1;`;

    const [results, fields] = await connection.query(query);

    if (results.length > 0) {
      const passenger = results[0];
      return res.status(200).json({
        data: {
          passenger_name: passenger.passenger_name,
          passenger_email: passenger.passenger_email,
          passenger_id: passenger.passenger_id,
          passenger_dob: passenger.passenger_dob,
        },
        message: "User is logged in",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

app.post("/forgot", async (req, res) => {
  try {
    const { passenger_email, password } = req.body;
    if (!passenger || !password) {
      return res
        .status(400)
        .json({ error: "Email and new password are required" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password in the database
    const query = `UPDATE Passenger SET password = '${hashedPassword}' WHERE passenger_email = '${passenger_email}';`;
    const [results] = await connection.query(query);

    // Check if the user's password was updated
    if (results.affectedRows === 0) {
      // No user found with the provided email
      return res.status(404).json({ error: "Passenger not found" });
    } else {
      // Password updated successfully
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred during the password update process" });
  }
});

app.post("/search", async (req, res) => {
  try {
    const { source, destination, date } = req.body;
    let current_time = new Date();
    current_time = `${current_time.getHours()}:${current_time.getMinutes()}:${current_time.getSeconds()}`;

    const query = `
  SELECT T.*, S.arrival_time, S.departure_time
  FROM Schedule S
  INNER JOIN Train T ON S.train_id = T.train_id
  WHERE S.from_station_id = ?
    AND S.to_station_id = ?
    AND S.arrival_time > ?
  ORDER BY S.arrival_time;
`;
    const [results] = await connection.execute(query, [
      source,
      destination,
      current_time,
    ]);
    if (results.length > 0) {
      return res.status(200).json({
        results,
        info: {
          source,
          destination,
          date,
        },
      });
    } else {
      // No results found, call external API
      const apiResponse = await axios.get(
        `https://indian-railway-api.cyclic.app/trains/betweenStations/?from=${source}&to=${destination}`
      );
      const apiData = apiResponse.data.data;

      await connection.beginTransaction();

      for (const train of apiData) {
        const trainBase = train.train_base;
        console.dir(trainBase, { depth: null });
        // Insert Stations
        await checkAndInsertStation(
          trainBase.from_stn_code,
          trainBase.from_stn_name,
          connection
        );
        await checkAndInsertStation(
          trainBase.to_stn_code,
          trainBase.to_stn_name,
          connection
        );

        // Insert Train and Schedule
        await insertTrainAndSchedule(trainBase, connection);
      }

      await connection.commit();

      // Execute query with parameters
      const [newResults] = await connection.execute(query, [
        source,
        destination,
        current_time,
      ]);

      if (newResults.length === 0) {
        return res.status(404).json({
          error: "No trains found between the given stations",
        });
      }

      return res.status(200).json({
        message: "Data fetched from external API and inserted successfully",
        results: newResults,
        info: {
          source,
          destination,
          date,
        },
      });
    }
  } catch (error) {
    if (connection) await connection.rollback();
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred during the search process" });
  }
});

async function insertTrainAndSchedule(trainBase, connection) {
  // Check if the train already exists
  const [existingTrain] = await connection.execute(
    `SELECT train_id FROM Train WHERE train_id = ?`,
    [trainBase.train_no]
  );

  let trainId = trainBase.train_no;

  if (existingTrain.length === 0) {
    // Insert new train
    try {
      const [insertResult] = await connection.execute(
        `INSERT INTO Train (train_id, train_name, source_id, destination_id, start_time, end_time, status, total_seats)
             VALUES (?, ?, ?, ?, STR_TO_DATE(?, '%H.%i'), STR_TO_DATE(?, '%H.%i'), 'Scheduled', ?)`,
        [
          trainBase.train_no,
          trainBase.train_name,
          trainBase.from_stn_code,
          trainBase.to_stn_code,
          trainBase.from_time,
          trainBase.to_time,
          200 + Math.floor(Math.random() * 100),
        ] // total_seats is set to 0 as an example
      );
    } catch (error) {
      console.log("Error inserting train", error);
    }

    trainId = trainBase.train_no;
  } else {
    trainId = existingTrain[0].train_id;
  }

  // Insert schedule, assuming from and to stations might vary per train route
  try {
    // Check if the schedule already exists
    const [existingSchedule] = await connection.execute(
      `SELECT * FROM Schedule 
     WHERE train_id = ? AND station_id = ? AND from_station_id = ? AND to_station_id = ?`,
      [
        trainId,
        trainBase.from_stn_code,
        trainBase.source_stn_code,
        trainBase.to_stn_code,
      ]
    );

    if (existingSchedule.length === 0) {
      // Insert schedule
      try {
        await connection.execute(
          `INSERT INTO Schedule (train_id, station_id, from_station_id, to_station_id, platform, arrival_time, departure_time)
         VALUES (?, ?, ?, ?, NULL, STR_TO_DATE(?, '%H.%i'), STR_TO_DATE(?, '%H.%i'))`,
          [
            trainId,
            trainBase.from_stn_code,
            trainBase.from_stn_code,
            trainBase.to_stn_code,
            trainBase.from_time,
            trainBase.to_time,
          ]
        );
        console.log("New schedule inserted for train:", trainBase.train_name);
      } catch (error) {
        console.log("Error inserting schedule:", error);
      }
    } else {
      console.log(
        "Schedule already exists for train:",
        trainBase.train_name,
        existingSchedule
      );
      // Optionally update the existing schedule here if needed
    }
  } catch (error) {
    console.log("Error inserting schedule");
  }
}

async function checkAndInsertStation(stationCode, stationName, connection) {
  const [rows] = await connection.execute(
    `SELECT station_id FROM Station WHERE station_id = ?`,
    [stationCode]
  );

  if (rows.length === 0) {
    await connection.execute(
      `INSERT INTO Station (station_id, station_name, city) VALUES (?, ?, ?);`,
      [stationCode, stationName, stationName] // Assuming city is the same as station name for simplicity
    );
  }
}

app.get("/tickets", authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;

    // Fetch the passenger_id using the email
    const passengerQuery = `SELECT passenger_id FROM Passenger WHERE passenger_email = ?`;
    const [passengerResults] = await connection.execute(passengerQuery, [
      email,
    ]);

    if (passengerResults.length === 0) {
      return res.status(404).json({
        error: "Passenger not found",
      });
    }

    const passenger_id = passengerResults[0].passenger_id;

    // Modified query to fetch distinct tickets with associated train and schedule info
    const query = `
SELECT DISTINCT
    Ticket.ticket_id,
    Ticket.created_at,
    Ticket.status,
    Train.train_id,
    Train.train_name,
    Train.status AS train_status,
    Schedule.departure_time,
    Schedule.arrival_time,
    FromStation.station_name AS from_station_name,
    FromStation.city AS from_station_city,
    ToStation.station_name AS to_station_name,
    ToStation.city AS to_station_city
FROM
    Ticket
INNER JOIN
    TravellerTickets ON Ticket.ticket_id = TravellerTickets.ticket_id
INNER JOIN
    Seat ON TravellerTickets.seat_id = Seat.seat_id
INNER JOIN
    Train ON Seat.train_id = Train.train_id
INNER JOIN
    Schedule ON Train.train_id = Schedule.train_id
INNER JOIN
    Station AS FromStation ON Train.source_id = FromStation.station_id
INNER JOIN
    Station AS ToStation ON Train.destination_id = ToStation.station_id
WHERE
    Ticket.passenger_id = ?;
`;

    const [results] = await connection.execute(query, [passenger_id]);

    if (results.length === 0) {
      return res.status(404).json({
        error: "No tickets found for this passenger.",
      });
    }

    return res.status(200).json({
      tickets: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "An error occurred during the ticket fetching process",
      details: error.message,
    });
  }
});

app.get("/getStations", async (req, res) => {
  try {
    const query = `SELECT station_id,station_name FROM Station`;
    const [results, fields] = await connection.query(query);

    return res.status(200).json({ results });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred during the ticket process" });
  }
});

app.post("/checkoutDetails", async (req, res) => {
  try {
    const { source, destination, date, train_id } = req.body;

    const query = `SELECT T.*
    FROM Schedule S
    INNER JOIN Train T ON S.train_id = T.train_id
    WHERE S.from_station_id = ?
      AND S.to_station_id = ?
      AND S.arrival_time > ?
      AND T.train_id = ?
    ORDER BY S.arrival_time LIMIT 1;`;

    const [results] = await connection.execute(query, [
      source,
      destination,
      date,
      train_id,
    ]);

    if (results.length > 0) {
      // Check if there are seats available for this train
      let [seats] = await connection.execute(
        `SELECT * FROM Seat WHERE train_id = ?`,
        [train_id]
      );

      if (seats.length === 0) {
        // No seats found, create a new seat
        const randomPrice =
          800 + 100 * Math.floor(((2000 - 800) / 100) * Math.random());
        await connection.execute(
          `INSERT INTO Seat (train_id, type, price) VALUES (?, ?, ?)`,
          [train_id, "Standard", randomPrice]
        );

        const premiumPrice = randomPrice + 200;

        await connection.execute(
          `INSERT INTO Seat (train_id, type, price) VALUES (?, ?, ?)`,
          [train_id, "Premium", premiumPrice]
        );
      }

      [seats] = await connection.execute(
        `SELECT * FROM Seat WHERE train_id = ?`,
        [train_id]
      );

      // get all the stations between source and destination from the schedule using train_id
      const [stations] = await connection.execute(
        `SELECT 
    s1.station_name AS from_station_name,
    s1.city AS from_city,
    s2.station_name AS at_station_name,
    s2.city AS at_city,
    s3.station_name AS to_station_name,
    s3.city AS to_city,
    sc.arrival_time,
    sc.departure_time
FROM 
    Schedule sc
LEFT JOIN 
    Station s1 ON sc.from_station_id = s1.station_id
LEFT JOIN 
    Station s2 ON sc.station_id = s2.station_id
LEFT JOIN 
    Station s3 ON sc.to_station_id = s3.station_id
WHERE 
    sc.train_id = ?
ORDER BY 
    sc.arrival_time;`,
        [train_id]
      );

      return res.status(200).json({
        results,
        stations,
        seats,
        info: {
          source,
          destination,
          date,
        },
      });
    }

    return res.status(404).json({
      error: "No trains found between the given stations",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred during the checkout process" });
  }
});

app.post("/bookTicket", authenticateToken, async (req, res) => {
  const { passengers } = req.body;
  const email = req.user.email;

  if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({ error: "Passenger details are required" });
  }

  try {
    const passengerQuery = `SELECT passenger_id FROM Passenger WHERE passenger_email = ?`;

    const [passengerResults] = await connection.execute(passengerQuery, [
      email,
    ]);

    if (passengerResults.length === 0) {
      return res.status(404).json({
        error: "Passenger not found",
      });
    }

    const passenger_id = passengerResults[0].passenger_id;

    const seatIds = passengers.map((passenger) => passenger.seat);
    console.log("Seat IDs:", seatIds); // Check what's being sent to the query

    const placeholders = seatIds.map(() => "?").join(","); // Create placeholders for each seat id
    const seatQuery = `SELECT * FROM Seat WHERE seat_id IN (${placeholders})`;
    const [seatResults] = await connection.execute(seatQuery, seatIds);

    console.log("Seat Results:", seatResults); // Check what comes back from the database

    const seatsById = seatResults.reduce((acc, seat) => {
      acc[seat.seat_id] = seat;
      return acc;
    }, {});

    const totalAmount = passengers.reduce(
      (acc, passenger) => acc + parseInt(seatsById[passenger.seat].price),
      0
    );

    console.log("Total Amount:", totalAmount); // Check the total amount

    const options = {
      amount: (totalAmount * 100).toString(),
      currency: "INR",
      receipt: nanoid(),
      payment_capture: 1,
    };

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const paymentResponse = await razorpay.orders.create(options);

    // insert into payment table
    const [paymentResult] = await connection.execute(
      `INSERT INTO Payment (payment_id, price, status) VALUES (?, ?, 'Pending')`,
      [paymentResponse.id, totalAmount]
    );

    // Assuming payment is initiated successfully, create a single ticket for all passengers
    const [ticketResult] = await connection.execute(
      `INSERT INTO Ticket (passenger_id, payment_id, status) VALUES (?, ?, 'Pending')`,
      [passenger_id, paymentResponse.id]
    );

    const ticketId = ticketResult.insertId;

    // Insert each passenger into TravellerTickets table
    await Promise.all(
      passengers.map(async (passenger) => {
        console.log("Passenger:", passenger); // Check the passenger details

        const [travellerResult] = await connection.execute(
          `INSERT INTO Traveller (passenger_id, traveller_name, traveller_email, traveller_phone, traveller_age
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            passenger_id,
            passenger.travellerName,
            passenger.travellerEmail,
            passenger.travellerPhone,
            parseInt(passenger.travellerAge),
          ]
        );

        const travellerId = travellerResult.insertId;

        console.log("Traveller ID:", travellerId); // Check the traveller ID

        const [travellerTicketResult] = await connection.execute(
          `INSERT INTO TravellerTickets (ticket_id, traveller_id, seat_id, food_preference) VALUES (?, ?, ?, ?)`,
          [ticketId, travellerId, passenger.seat, passenger.foodPreference]
        );
      })
    );

    res.status(200).json({
      message: "Ticket booked successfully",
      ticketId: ticketId,
      paymentId: paymentResponse.id,
      amount: totalAmount,
      id: paymentResponse.id,
      currency: "INR",
      receipt: paymentResponse.receipt,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Failed to book tickets", details: err.message });
  }
});

app.post("/verifyPayment", authenticateToken, async (req, res) => {
  const { payment_id, order_id, razorpay_signature } = req.body;

  try {
    // Fetch the payment details from Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Validate the payment signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        error: "Invalid payment signature.",
      });
    }

    // Retrieve the payment from Razorpay to verify its status
    const payment = await razorpay.payments.fetch(payment_id);

    if (payment.status !== "captured") {
      return res.status(400).json({
        error: "Payment verification failed or the payment is not captured.",
      });
    }

    console.log("Payment details:", payment_id);

    // Assuming the payment is successful, update the payment table and ticket status
    await connection.execute(
      `UPDATE Payment SET status = ? WHERE payment_id = ?`,
      ["Completed", order_id]
    );

    await connection.execute(
      `UPDATE Ticket SET status = 'Confirmed' WHERE payment_id = ?`,
      [order_id]
    );

    const [ticketResults] = await connection.execute(
      `SELECT * FROM Ticket WHERE payment_id = ?`,
      [order_id]
    );

    console.log("Ticket details:", ticketResults);

    if (ticketResults.length === 0) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    const ticketId = ticketResults[0].ticket_id;

    // Optionally, add any additional business logic here, e.g., sending confirmation emails, etc.

    return res.status(200).json({
      success: true,
      message: "Payment successful and ticket confirmed.",
      ticketId, // Assuming the ticket ID was stored in payment notes
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "An error occurred during the payment verification process",
      details: error.message,
    });
  }
});

app.post("/getTicket", authenticateToken, async (req, res) => {
  try {
    const { ticket_id } = req.body;
    const email = req.user.email;
    const isAdmin = req.user.isAdmin ?? false;

    // Get the passenger_id from the Passenger table using the email
    const passengerQuery = `SELECT passenger_id FROM Passenger WHERE passenger_email = ?`;
    const [passengerResults] = await connection.execute(passengerQuery, [
      email,
    ]);

    if (passengerResults.length === 0) {
      return res.status(404).json({
        error: "Passenger not found",
      });
    }

    const passenger_id = passengerResults[0].passenger_id;

    let ticketQuery, ticketResults;

    if (isAdmin) {
      ticketQuery = `
SELECT 
    Ticket.ticket_id,
    Ticket.status,
    Ticket.created_at,
    Train.train_name,
    Train.train_id,
    Train.status AS train_status,
    Schedule.departure_time,
    Schedule.arrival_time,
    FromStation.station_name AS from_station_name,
    FromStation.city AS from_station_city,
    ToStation.station_name AS to_station_name,
    ToStation.city AS to_station_city,
    Seat.type AS seat_type,
    Seat.price AS seat_price
FROM 
    Ticket
INNER JOIN 
    TravellerTickets ON Ticket.ticket_id = TravellerTickets.ticket_id
INNER JOIN 
    Seat ON TravellerTickets.seat_id = Seat.seat_id
INNER JOIN 
    Train ON Seat.train_id = Train.train_id
INNER JOIN 
    Schedule ON Train.train_id = Schedule.train_id
INNER JOIN 
    Station AS FromStation ON Schedule.from_station_id = FromStation.station_id
INNER JOIN 
    Station AS ToStation ON Schedule.to_station_id = ToStation.station_id
WHERE 
    Ticket.ticket_id = ?;
    `;

      [ticketResults] = await connection.execute(ticketQuery, [ticket_id]);
    } else {
      // Query to get the ticket details
      ticketQuery = `
SELECT 
    Ticket.ticket_id,
    Ticket.status,
    Ticket.created_at,
    Train.train_name,
    Train.train_id,
    Train.status AS train_status,
    Schedule.departure_time,
    Schedule.arrival_time,
    FromStation.station_name AS from_station_name,
    FromStation.city AS from_station_city,
    ToStation.station_name AS to_station_name,
    ToStation.city AS to_station_city,
    Seat.type AS seat_type,
    Seat.price AS seat_price
FROM 
    Ticket
INNER JOIN 
    TravellerTickets ON Ticket.ticket_id = TravellerTickets.ticket_id
INNER JOIN 
    Seat ON TravellerTickets.seat_id = Seat.seat_id
INNER JOIN 
    Train ON Seat.train_id = Train.train_id
INNER JOIN 
    Schedule ON Train.train_id = Schedule.train_id
INNER JOIN 
    Station AS FromStation ON Schedule.from_station_id = FromStation.station_id
INNER JOIN 
    Station AS ToStation ON Schedule.to_station_id = ToStation.station_id
WHERE 
    Ticket.ticket_id = ? AND Ticket.passenger_id = ?;
`;

      [ticketResults] = await connection.execute(ticketQuery, [
        ticket_id,
        passenger_id,
      ]);
    }

    if (ticketResults.length === 0) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    // Query to get all travelers associated with this ticket
    const travelersQuery = `
SELECT
    Traveller.traveller_id,
    Traveller.traveller_name,
    Traveller.traveller_email,
    Traveller.traveller_phone,
    Traveller.traveller_age,
    TravellerTickets.food_preference,
    TravellerTickets.seat_id
FROM
    TravellerTickets
INNER JOIN
    Traveller ON TravellerTickets.traveller_id = Traveller.traveller_id
WHERE
    TravellerTickets.ticket_id = ?;
`;

    const [travelersResults] = await connection.execute(travelersQuery, [
      ticket_id,
    ]);

    return res.status(200).json({
      ticketDetails: ticketResults[0], // Send the first result as the main ticket details
      travelers: travelersResults, // All associated travelers
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "An error occurred during the ticket fetching process",
      details: error.message,
    });
  }
});

app.get("/:table_name", async (req, res) => {
  try {
    const { table_name } = req.params;
    console.log(table_name);

    const [results, fields] = await connection.query(
      `SELECT * FROM ${table_name};`
    );

    return res.status(200).json({ results });
  } catch (error) {
    console.log(error);
    console.log("ERROR AAYA");
    return res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
