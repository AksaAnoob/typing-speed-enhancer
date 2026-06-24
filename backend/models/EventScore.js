const mongoose = require("mongoose");

const eventScoreSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    score: {
        type: Number,
        required: true
    },

    // FIX: must match frontend keys exactly
    mode: {
        type: String,
        enum: ["rain", "fire"],
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("EventScore", eventScoreSchema);