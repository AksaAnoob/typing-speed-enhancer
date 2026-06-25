require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
const Score = require("./models/Score");
const BurstScore = require("./models/BurstScore");
const EventScore = require("./models/EventScore");
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
app.post("/save-event-score", async (req, res) => {
    try {
        const { username, score, mode } = req.body;

        console.log("EVENT RECEIVED:", username, score, mode);

        if (!username || !mode) {
            return res.status(400).json({ message: "Missing data" });
        }

        const existing = await EventScore.findOne({ username, mode });

        if (!existing) {
            const newScore = await EventScore.create({
                username,
                score,
                mode
            });

            console.log("CREATED:", newScore);

        } else if (score > existing.score) {
            existing.score = score;
            await existing.save();

            console.log("UPDATED SCORE");
        }

        res.json({ message: "Saved successfully" });

    } catch (err) {
        console.log("EVENT SAVE ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});
app.get("/leaderboard", async (req, res) => {
    try {

        const scores = await Score.find()
            .sort({ wpm: -1 })
            .limit(10);

        const leaderboard = await Promise.all(
            scores.map(async (score) => {

                const user = await User.findOne({
                    username: score.username
                });

                return {
                    username: score.username,
                    wpm: score.wpm,
                    accuracy: score.accuracy,
                    avatar: user?.avatar || null
                };
            })
        );

        res.json(leaderboard);

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

        const leaderboard = await Promise.all(
            scores.map(async (score) => {

                const user = await User.findOne({
                    username: score.username
                });

                return {
                    username: score.username,
                    score: score.score,
                    avatar: user?.avatar || null
                };
            })
        );

        res.json(leaderboard);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.get("/event-leaderboard", async (req, res) => {

    try {

        const scores = await EventScore.find()
            .sort({ score: -1 })
            .limit(10);

        const leaderboard = await Promise.all(
            scores.map(async (score) => {

                const user = await User.findOne({
                    username: score.username
                });

                return {
                    username: score.username,
                    score: score.score,
                    mode: score.mode,
                    avatar: user?.avatar || null
                };
            })
        );

        res.json(leaderboard);

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

        // get typing score
        const typingScore = await Score.findOne({ username });

        // get burst score
        const burstScore = await BurstScore.findOne({ username });

        // ⭐ IMPORTANT: get user data (avatar stored here)
        const user = await User.findOne({ username });

        res.json({
            wpm: typingScore?.wpm || 0,
            accuracy: typingScore?.accuracy || 0,
            burstScore: burstScore?.score || 0,

            // ⭐ ADD THIS
            avatar: user?.avatar || null
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.post("/updateAvatar", async (req, res) => {
    const { username, avatar } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { username },
            { $set: { avatar } },
            { new: true, upsert: true }   // 🔥 IMPORTANT FIX
        );

        res.json({ message: "updated", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "update failed" });
    }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});