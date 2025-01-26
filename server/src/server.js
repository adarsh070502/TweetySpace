import { dirname } from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import dotenv from "dotenv";

// Loading env variables
dotenv.config({ path: "../.env" });

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Welcome to TweetySpaces backend!!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
