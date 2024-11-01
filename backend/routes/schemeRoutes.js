// Import dependencies
const express = require("express")
const router = express.Router()
const {getAllPublicSchemes, getAllSchemes, getOneScheme, createScheme, updateScheme, rateScheme, deleteScheme} = require("../controllers/schemeController")
const {auth, authPosition} = require("../middleware/verifyToken")
const {verifySchemeRating} = require("../middleware/checkConstaints")


// Connect routes to controller functions and use the appropritate authentication middleware functions
// Show all public schemes
router.get("/public", getAllPublicSchemes)

// Show all schemes, requires JWT verification and "Teacher" position
router.get("/", auth, authPosition("Teacher"), getAllSchemes)

// Show a specific scheme, requires JWT verification and "Teacher" position
router.get("/:_id", auth, authPosition("Teacher"), getOneScheme)

// Add a new scheme, requires JWT verification and "Teacher" position
router.post("/", auth, authPosition("Teacher"), createScheme)

// Update a scheme, requires JWT verification and "Teacher" position
router.put("/:_id", auth, authPosition("Teacher"), updateScheme)

// Rate a scheme
router.put("/rate/:_id", auth, authPosition("Teacher"), verifySchemeRating, rateScheme)

// Delete a scheme, requires JWT verification and "Teacher" position
router.delete("/:_id", auth, authPosition("Teacher"), deleteScheme)


// Export the updated router containing the included routes
module.exports = router