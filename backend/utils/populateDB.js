// Import dependencies
const connectDB = require("./connectDB")
const dotenv = require("dotenv").config()
const AssessmentCard = require("../models/assessmentSchema")
const MissionCard = require("../models/missionSchema")
const User = require("../models/userSchema")
const bcrypt = require('bcryptjs')

// Connects to MongoDB
connectDB()

// Defines dummy data
const dummyAssessmentCards = require("../../setup/dummy-assessment-cards.json")
const dummyMissionCards = require("../../setup/dummy-mission-cards.json")

// Functions to populate collections with dummy data
const populateAssessmentCollection = async () => {
    try {
        await AssessmentCard.insertMany(dummyAssessmentCards)
        console.log("Successfully populated assessment cards")
    } catch (error) {
        console.error("Error inserting data:", error)
    }
}
const populateMissionCollection = async () => {
    try {
        await MissionCard.insertMany(dummyMissionCards)
        console.log("Successfully populated mission cards")
    } catch (error) {
        console.error("Error inserting data:", error)
    }
}
const populateUserCollection = async () => {
    // Encrypts password, then creates the dummy user
    const password = "test123"
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const dummyUser = new User({
        fName: "Dummy",
        lName: "Admin",
        email: "dummy@admin.com",
        password: hashedPassword,
        university: "NTNU",
        department: "Design",
        position: "Teacher",
        role: "Administrator"
    })

    try {
        await dummyUser.save()
        console.log("Successfully populated users")
    } catch (error) {
        console.error("Error inserting data:", error)
    }
}

// Calls the functions
populateAssessmentCollection()
populateMissionCollection()
populateUserCollection()
