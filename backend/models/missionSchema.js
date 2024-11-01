// Whole Schema reused from Ola's Oblig 2

const mongoose = require("mongoose")
const missionCardSchema = new mongoose.Schema({
    card_id: {
        type: Number,
        required: true,
        unique: true
    },
    card_type: {
        type: String,
        required: true,
        lowercase: true
    },
    card_name: {
        type: String,
        required: true
    },
    card_description: {
        type: String,
        required: true
    },
    card_icon: {
        type: [String]
    }
})

module.exports = mongoose.model("Mission-card", missionCardSchema)