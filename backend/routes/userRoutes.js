// Most code reused from Ola's Oblig 2 – also essentially identical to code covered in classes
// New from Oblig 3: authentication middleware
// New additions: endpoint to show number of registered Teachers, endpoints to update user details (as a user) and add bookmarked schemes

// Import dependencies
const express = require("express")
const router = express.Router()
const {getAllUsers, getOneUser, getTeachers, updateUser, deleteUser, updateUserEdit, bookmarkScheme, getTeacherId} = require("../controllers/userController")
const {auth, authRole, authPosition} = require("../middleware/verifyToken")
const {verifyInput} = require("../middleware/checkConstaints")

// Connect routes to controller functions and use the appropritate authentication middleware functions
// Show the number of registered teachers
router.get("/teachers", getTeachers)

// Find the ObjectId of a teacher using from their email, requires JWT verification and teacher position
router.get("/teachers/:email", auth, authPosition("Teacher"), getTeacherId)

// Show all users, requires JWT verification and admin access
router.get("/", auth, authRole("Administrator"), getAllUsers)

// Show a specific user, requires JWT verification 
router.get("/:id", auth, getOneUser)

// Update a user as administrator, requires JWT verification and admin access
router.put("/:id", auth, authRole("Administrator"), updateUser)

// Update a user, requires JWT verification 
router.put("/update/:id", verifyInput, auth, updateUserEdit)

// Bookmark a scheme, requires JWT verification
router.put("/bookmark/:id", auth, bookmarkScheme)

// Delete a user entry, requires JWT verification 
router.delete("/:id", auth, deleteUser)


// Export the updated router containing the included routes
module.exports = router