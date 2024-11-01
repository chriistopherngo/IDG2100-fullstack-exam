// Controller reused from Oblig 3 – also largely similar to code covered in classes
// New additions: HTTP-only cookies for handling JWT, refresh token

// Import dependencies
const User = require("../models/userSchema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config({ path: "../.env" })

// Register new user
const register = async (req,res) => {
    // Check if user already exists
    const emailExists = await User.findOne({email: req.body.email})

    if(emailExists){
        // Catch block for badly formatted requests
        return res.status(409).send("email already exists")
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create new user
    const user = new User({
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: hashedPassword,
        university: req.body.university,
        department: req.body.department,
        position: req.body.position
    })

    // Save new user
    try{
        const savedUser = await user.save()
        res.status(200).send(savedUser)
    } catch(error){
        // Catch block for badly formatted requests
        res.status(400).send(error)
    }
}

// Log in with existing user
const login = async (req,res) => {
    // Check if email exists
    const user = await User.findOne({email: req.body.email})
    if(!user){
        // Catch block for badly formatted requests
        return res.status(404).send("email could not be found in database")
    }

    // Check if password is matched
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword){
        // Catch block for badly formatted requests
        return res.status(401).send("invalid password")
    }


// The following code was adapted from Dave Gray's MERN stack application tutorials
// Tutorial for JWT authentication: https://www.youtube.com/watch?v=4TtAGhr61VI
// MERN stack tutorial repository (most relevant code is in lesson_08-backend): https://github.com/gitdagray/mern_stack_course
    // Define access,- and refresh tokens
    const accessToken = jwt.sign(
        {
            _id: user._id,
            role: user.role,
            position: user.position
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
    )

    const refreshToken = jwt.sign(
        {"userId": user._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "7d"}
    )

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000 // expiration time in ms (7 days here)
    })

    res.json({accessToken})
}

// Refresh function also adapted from the same Dave Gray tutorial
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({message: "Unauthorized"})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({message: "Forbidden"})

            const user = await User.findOne({_id: decoded.userId})

            if(!user) return res.status(401).send("Unauthorized")

            const accessToken = jwt.sign(
                {
                    _id: user._id,
                    role: user.role,
                    position: user.position
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "15m"}
            )

            res.status(200).send(accessToken)
        }
    )
}

// Log the user out
const logout = async (req, res) => {
    if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt
        // Clears the refresh token cookie
        res.clearCookie("jwt")
        return res.status(200).json({message: "Successfully logged out"})
    }
}


// Exports the functions created in the controller
module.exports = {register, login, refresh, logout}