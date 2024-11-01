// Most code reused from Ola's Oblig 2 – also essentially identical to code covered in classes
// New from Oblig 3: more clear and descriptive error messages, password encryption, changed which fields can be updated
// New additions: endpoint to show number of registered Teachers

// Import dependencies
const User = require("../models/userSchema")
const bcrypt = require("bcryptjs")

// Show number of teachers
const getTeachers = async (req, res) => {
    try {
        // Finds all users based with the position "Teacher"
        // This only returns the users' mongoDB _id, as well as their position, to avoid sending any potentially sensitive personal information without authentication
        // You could also return showTeachers.length to only send
        const showTeachers = await User.find({ position: "Teacher" }).select("position")
        // Throws a 404 error if no users are found
        if (!showTeachers) {
            return res.status(404).send("No teachers found")
        }
        // Return the result
        res.status(200).json(showTeachers)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Show the ObjectId of a specific teacher
const getTeacherId = async (req, res) => {
    try {
        // 
        const showTeacher = await User.find({ email: req.params.email, position: "Teacher" }).select("_id")
        // Throws a 404 error if no user is found
        if (!showTeacher) {
            return res.status(404).send("Teacher not found")
        }
        // Return the matching teacher
        res.status(200).json(showTeacher)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Show all user
const getAllUsers = async (req, res) => {
    try {
        // Searches database for all users
        const showUsers = await User.find()
        // Throws a 404 error if no users are found
        if (!showUsers) {
            return res.status(404).send("No users found")
        }
        // Returns all the users on success
        res.status(200).json(showUsers)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Show a specific user
const getOneUser = async (req, res) => {
    try {
        // Finds a user based on the email given in the request
        const showUser = await User.find({ _id: req.params.id })
        // Throws a 404 error if no user is found
        if (!showUser) {
            return res.status(404).send("User not found")
        }
        res.status(200).json(showUser)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Update a user, with admin access
// This is used for administrators to manage users' permissions
const updateUser = async (req, res) => {
    try {
        // Update the user whose id is specified in the URL
        const updateUser = await User.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    position: req.body.position,
                    role: req.body.role,
                },
            }
        )
        // Returns a json response, and a success status
        res.status(200).json(updateUser)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Delete a user entry
const deleteUser = async (req, res) => {
    try {
        // Deletes the user whose id is specified in the URL
        const removeUser = await User.deleteOne({ _id: req.params.id })
        // Returns 200 success, as well as the id of the deleted user
        res
            .status(200)
            .json({ message: `Deleted the user with id ${req.params.id}` })
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Update a user, without admin access
// This is used for the user to update their own information
const updateUserEdit = async (req, res) => {
    try {
        // salt and hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // Update the user whose id is specified in the URL
        const updateUser = await User.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    fName: req.body.fName,
                    lName: req.body.lName,
                    email: req.body.email,
                    password: hashedPassword,
                    university: req.body.university,
                    department: req.body.department,
                },
            },
            // This option returns the updated document: https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
            { new: true }
        )

        res.status(200).json(updateUser)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Add or remove scheme bookmarks
const bookmarkScheme = async (req, res) => {
    try {
        // Find the current user's bookmarks
        const showBookmarks = await User.findOne({_id: req.params.id}).select("bookmarks")

        // If the current bookmark is not in the list, add it
        if (!showBookmarks.bookmarks.includes(req.body.bookmark)) {
            const addBookmark = await User.updateOne({_id: req.params.id}, {$push: {bookmarks: req.body.bookmark}})
            res.status(200).send("Added bookmark")
        // If it is already there, remove it
        } else {
            const addBookmark = await User.updateOne({_id: req.params.id}, {$pull: {bookmarks: req.body.bookmark}})
            res.status(200).send("Removed bookmark")
        }
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}


// Exports the functions created in the controller
module.exports = {getAllUsers, getOneUser, getTeachers, updateUser, deleteUser, updateUserEdit, bookmarkScheme, getTeacherId}
