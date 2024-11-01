// Schema mostly reused from Ola's Oblig 2
// New from Oblig 3: role property

const mongoose = require("mongoose")
const Scheme = require("./schemeSchema")

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
        minLength: 2
    },
    lName: {
        type: String,
        required: true,
        minLength: 2
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required:true,
        minLength: 8
    },
    university: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ["Student", "TA", "Teacher"],
        required: true
    },
    role: {
        type: String,
        enum: ["User", "Administrator"],
        default: "User",
        required: true
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scheme"
    }]
})

module.exports = mongoose.model("User", userSchema)