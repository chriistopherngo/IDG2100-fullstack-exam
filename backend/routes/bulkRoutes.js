// Routes created from combining "bulkAddRoutes.js" and "bulkEditRoutes.js" from Oblig 3
// New from Oblig 3: bulk delete functionality

// Import dependencies
const express = require("express")
const router = express.Router()
const {addAssessmentCards, addMissionCards, editAssessmentCards, editMissionCards, deleteAssessmentCards, deleteMissionCards} = require("../controllers/bulkController")
const {auth, authRole} = require("../middleware/verifyToken")
const {bulkUpload}= require('../utils/multerSetup')
const {iconUpload}= require('../utils/multerSetup')
const {upload}= require('../utils/multerSetup')

// Connect routes to controller functions and use the appropritate authentication middleware functions
// Add multiple assessment cards, requires JWT verification and admin access
router.post("/add-assessment", bulkUpload.single('file'), auth, authRole("Administrator"), addAssessmentCards)

// Add multiple mission cards, requires JWT verification and admin access
router.post("/add-mission", bulkUpload.single('file'), auth, authRole("Administrator"), addMissionCards)

// Edit multiple assessment cards, requires JWT verification and admin access
router.put("/edit-assessment", auth, authRole("Administrator"), upload.any('new_card_icon'), editAssessmentCards)

// Edit multiple mission cards, requires JWT verification and admin access
router.put("/edit-mission", auth, authRole("Administrator"),upload.any('new_card_icon'), editMissionCards)


// Export the updated router containing the included routes
module.exports = router