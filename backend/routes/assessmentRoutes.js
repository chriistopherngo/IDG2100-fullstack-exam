// Most code reused from Ola's Oblig 2 – also essentially identical to code covered in classes
// New from Oblig 3: authentication middleware

// Import dependencies
const express = require("express")
const router = express.Router()
const {getAllAssessmentCards, getOneAssessmentCard, createAssessmentCard, updateAssessmentCard, deleteAssessmentCard} = require("../controllers/assessmentController")
const {auth, authRole} = require("../middleware/verifyToken")
const {upload} = require("../utils/multerSetup")


// Connect routes to controller functions and use the appropritate authentication middleware functions
// Show all assessment cards
router.get("/", getAllAssessmentCards)

// Show a specific assessment card
router.get("/:card_id", getOneAssessmentCard)

// Add a new assessment card, requires JWT verification and admin access
router.post("/", auth, authRole("Administrator"), upload.single('card_icon'),  createAssessmentCard)

// Update an assessment card, requires JWT verification and admin access
router.put("/:card_id", auth, authRole("Administrator"),upload.single('card_icon'), updateAssessmentCard)

// Delete an assessment card, requires JWT verification and admin access
router.delete("/:card_id", auth, authRole("Administrator"), deleteAssessmentCard)


// Export the updated router containing the included routes
module.exports = router