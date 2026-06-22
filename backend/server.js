require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
const Score = require("./models/Score");
const BurstScore = require("./models/BurstScore");
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
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            "typemasterysecret",
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            username: user.username
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});
app.post("/save-score", async (req, res) => {
    try {

        const { username, wpm, accuracy } = req.body;
        
        const existingScore = await Score.findOne({ username });

        if (!existingScore) {

            await Score.create({
                username,
                wpm,
                accuracy
            });

        } else if (wpm > existingScore.wpm) {

            existingScore.wpm = wpm;
            existingScore.accuracy = accuracy;

            await existingScore.save();
        }

        res.json({
            message: "Score saved successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
app.post("/save-burst-score", async (req, res) => {

    try {

        const { username, score } = req.body;
        
        const existingScore =
            await BurstScore.findOne({ username });

        if (!existingScore) {

            await BurstScore.create({
                username,
                score
            });

        } else if (score > existingScore.score) {

            existingScore.score = score;

            await existingScore.save();
        }

        res.json({
            message: "Burst score saved"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.get("/leaderboard", async (req, res) => {
    try {
        const scores = await Score.find()
            .sort({ wpm: -1 })
            .limit(10);

        res.json(scores);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});
app.get("/burst-leaderboard", async (req, res) => {

    try {

        const scores = await BurstScore.find()
            .sort({ score: -1 })
            .limit(10);

        res.json(scores);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.get("/profile/:username", async (req, res) => {

    try {

        const username = req.params.username;

        const typingScore =
            await Score.findOne({ username });

        const burstScore =
            await BurstScore.findOne({ username });

        res.json({
            wpm: typingScore?.wpm || 0,
            accuracy: typingScore?.accuracy || 0,
            burstScore: burstScore?.score || 0
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});