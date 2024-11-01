// Import dependencies
const jwt = require("jsonwebtoken")

// Token verification
const auth = (req,res,next) => {
    // Get the token from the cookie
    const authHeader = req.headers.authorization || req.headers.Authorization
    // Return an error if the token is missing from the headers, or if the token doesn't start with "Bearer"
    if(!authHeader?.startsWith("Bearer ")) {
        return res.status(401).send("Unauthorized")
    }
    try {
        // Separate the "Bearer [token]" header to just get the token itself
        const token = authHeader.split(" ")[1]
        // Verify the token based on the secret in the .env file
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // Assigns the result of the jwt.verify() fuction to req.user, then continues
        req.user = verified
        next()
    } catch (error) {
        res.status(400).send("invalid token")
    }
}

// Role checking
function authRole(role) {
    return (req,res,next) => {
        // If the req.user role does not match the role passed as a function argument, throw an error
        if (req.user.role !== role) {
            res.status(401)
            return res.send("Permission denied")
        }
        next()
    }
}

// Position checking
function authPosition(pos) {
    return (req,res,next) => {
        // If the req.user position does not match the position passed as a function argument, throw an error
        if (req.user.position !== pos) {
            res.status(401)
            return res.send("Permission denied")
        }
        next()
    }
}

// Exports the middleware functions
module.exports = {auth, authRole, authPosition}