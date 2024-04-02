import express from "express";
import mysql from "mysql2/promise";
import "dotenv/config";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8080"],
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
});

app.get("/", async (req, res) => {
  const [results, fields] = await connection.query("SHOW TABLES;");

  return res.status(200).json({ results });
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

app.post("/register", async (req, res) => {
  try {
    const {
      user_name,
      user_email,
      user_dob,
      user_password,
      user_phone,
      user_sex,
    } = req.body;
    const saltRounds = 10; // Adjust the cost factor as needed, higher values are more secure but more computationally expensive.
    const hashedPassword = await bcrypt.hash(user_password, saltRounds);

    const dobDate = new Date(user_dob);
    const month = dobDate.getMonth() + 1;
    const year = dobDate.getFullYear();
    const date = dobDate.getDate();
    const today = new Date();
    const createdAt = today.toISOString().slice(0, 19).replace("T", " ");

    const query = `INSERT INTO User(user_name, user_email, user_password, user_sex, user_phone, user_dob, user_created_at, user_is_admin) VALUES('${user_name}','${user_email}','${hashedPassword}','${user_sex}','${user_phone}','${year}-${month}-${date}','${createdAt}',0);`;
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
    const { user_email, user_password } = req.body;
    const query = `SELECT user_id, user_password FROM User WHERE user_email = '${user_email}' LIMIT 1;`;
    const [results, fields] = await connection.query(query);

    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(user_password, user.user_password);

      if (isMatch) {
        // Passwords match, return success response
        return res
          .status(200)
          .json({ success: true, message: "Login successful" });
      } else {
        // Passwords do not match
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      // User not found
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
