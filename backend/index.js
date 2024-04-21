import express from "express";
import mysql from "mysql2/promise";
import "dotenv/config";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

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
    const { source, destination } = req.body;
    const query = `SELECT * FROM Train where source_id='${source}' and destination_id='${destination}';`;
    const [results, fields] = await connection.query(query);

    return res.status(200).json({ results });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred during the search process" });
  }
});
app.get("/tickets", async (req, res) => {
  try {
    const query = `SELECT ticket_id,payment_id,status FROM Ticket`;
    const [results, fields] = await connection.query(query);

    return res.status(200).json({ results });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred during the ticket process" });
  }
});
app.get("/getStations", async (req, res) => {
  try {
    const query = `SELECT station_id,station_name FROM Station`;
    const [results, fields] = await connection.query(query);

    return res.status(200).json({ results });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred during the ticket process" });
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
