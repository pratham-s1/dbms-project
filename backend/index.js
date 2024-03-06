import express from "express";
import mysql from "mysql2/promise";
import "dotenv/config";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST ?? "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.get("/", async (req, res) => {
  const [results, fields] = await connection.query("SHOW TABLES;");

  return res.status(200).json({ results });
});

app.get("/:table_name", async (req, res) => {
  const { table_name } = req.params;
  const [results, fields] = await connection.query(
    `SELECT * FROM ${table_name};`
  );

  return res.status(200).json({ results });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
