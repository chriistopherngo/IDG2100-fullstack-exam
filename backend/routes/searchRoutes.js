// All code reused from Ola's Oblig 2 – also essentially identical to code covered in classes

// Import dependencies
const express = require("express")
const router = express.Router()
const {search} = require("../controllers/searchController")

// Sole route, handling search requests
router.get("/", search)


// Export the updated router containing the included routes
module.exports = router