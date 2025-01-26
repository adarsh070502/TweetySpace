const express = require("express");
const connectDB = require("./config/database");
const app = express();

app.use(express.json());
connectDB()
  .then(() => {
    console.log("Database Connection Done Successfully");
    app.listen(3000, () => {
      console.log("App is listening to Port 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection not successful", err);
  });
