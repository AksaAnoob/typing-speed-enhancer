require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Error:", err);
});

app.get("/", (req, res) => {
    res.send("Type Mastery Backend Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});