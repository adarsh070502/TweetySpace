const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
app.use("/", authRouter);
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
