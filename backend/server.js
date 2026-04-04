require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const extensionRoutes = require("./routes/extensionRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

connectDB();

app.use("/api", extensionRoutes);

app.listen(5000, () => {
  console.log("Server running ");
});