const mongoose = require("mongoose")
const User = require("./userSchema")
const Mission = require("./missionSchema")
const Assessment = require("./assessmentSchema")

const schemeSchema = new mongoose.Schema({
    mission_cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mission",
        required: true
    }],
    assessment_cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: {
        type: [Number],
        required: true
    },
    visibility: {
        type: String,
        enum: ["private", "public"],
        default: "private",
        lowercase: true,
        required: true
    },
    avg_rating: {
        type: Number,
        default: 0
    }
})


module.exports = mongoose.model("Scheme", schemeSchema)