// Route reused from Oblig 3 – also essentially identical to code covered in classes
// New additions: token refresh route

// Import dependencies
const express = require("express")
const router = express.Router()
const {register, login, refresh, logout} = require("../controllers/authController")
const {verifyInput} = require('../middleware/checkConstaints')

// Connect routes to controller functions
// Register new user
router.post("/register", verifyInput, register)

// Login with an existing user
router.post('/login', login)

// Request an accessToken using the refreshToken (cookie)
router.get("/refresh", refresh)

// Log out
router.get("/logout", logout)

// Export the updated router containing the included routes
module.exports = router