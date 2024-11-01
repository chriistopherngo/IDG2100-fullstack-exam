// Most code reused from Ola's Oblig 2 – also essentially identical to code covered in classes
// New from Oblig 3: authentication middleware

// Import dependencies
const express = require("express")
const router = express.Router()
const {getAllMissionCards, getOneMissionCard, createMissionCard, updateMissionCard, deleteMissionCard} = require("../controllers/missionController")
const {auth, authRole} = require("../middleware/verifyToken")
const {upload} = require("../utils/multerSetup")


// Connect routes to controller functions and use the appropritate authentication middleware functions
// Show all mission cards
router.get("/", getAllMissionCards)

// Show a specific mission card
router.get("/:card_id", getOneMissionCard)

// Add a new mission card, requires JWT verification and admin access
router.post("/", auth, authRole("Administrator"), upload.single('card_icon'), createMissionCard)

// Update a mission card, requires JWT verification and admin access
router.put("/:card_id", auth, authRole("Administrator"), upload.single('card_icon'), updateMissionCard)

// Delete a mission card, requires JWT verification and admin access
router.delete("/:card_id", auth, authRole("Administrator"), deleteMissionCard)


// Export the updated router containing the included routes
module.exports = router