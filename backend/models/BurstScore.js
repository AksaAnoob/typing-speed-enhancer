const mongoose = require("mongoose");

const burstScoreSchema = new mongoose.Schema({
    username: String,
    score: Number
});

module.exports = mongoose.model(
    "BurstScore",
    burstScoreSchema
);