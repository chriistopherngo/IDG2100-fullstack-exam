const verifyInput = (req, res, next) => {
    // check if the email is valid format
    if (req.body.email) {
        // regex source: https://emaillistvalidation.com/blog/email-validation-in-javascript-using-regular-expressions-the-ultimate-guide/
        if (!req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            return res.status(400).send(`Please use the email format: example@example.com.`)
        } 
    } 

    // check if the password is valid format
    if (req.body.password) {
        if (req.body.password.length < 8 ) {
            return res.status(400).send("Password must contain at minimum eight characters.")
        } 
    } 

    next()
}

// Verify that scheme ratings are in the valid range of between 1 and 5
const verifySchemeRating = (req,res,next) => {
    if (req.body.rating === undefined) {
        return res.status(400).send("Rating is undefined")
    }
    if (req.body.rating < 1 || req.body.rating > 5) {
        return res.status(400).send("Rating must be between 1 and 5")
    }
    next()
}

module.exports = {verifyInput, verifySchemeRating}
