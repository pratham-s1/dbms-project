import express from "express";
import mysql from "mysql2/promise";
import "dotenv/config";
import cors from "cors";

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
    console.log("ERROR AAYA");
    return res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
