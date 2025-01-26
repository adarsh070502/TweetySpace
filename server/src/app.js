import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

// Creating app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // To parse/handle urlencoded data
app.use(express.json()); // To parse/handle json data
app.use(morgan("dev")); // Logging

export default app;
