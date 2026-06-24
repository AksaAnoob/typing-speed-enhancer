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

    mode: {
        type: String,
        enum: ["rain", "fire"], // ensures only valid modes
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("EventScore", eventScoreSchema);