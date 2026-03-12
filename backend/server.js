require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const extensionRoutes = require("./routes/extensionRoutes");

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api", extensionRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});