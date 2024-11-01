// Import dependencies
const Scheme = require("../models/schemeSchema")


// Show all publicly available assessment schemes
const getAllPublicSchemes = async (req,res) => {
    try {
        // Searches database for all schemes marked as publicly visible
        // The results are sorted in descending order by their average rating - this makes it easier to implement the schemes in the landing page
        const showSchemes = await Scheme.find({visibility: "public"}).sort({avg_rating: -1, ratings: 1})
        // Throws a 404 error if no schemes are found
        if (!showSchemes) {
            return res.status(404).send("No schemes found")
        }
        // Returns all the public schemes on success
        res.status(200).json(showSchemes)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Show all of a user's assessment schemes
const getAllSchemes = async (req,res) => {
    try {
        // Searches database for all schemes where the creator matches the ObjectId of the user
        const showSchemes = await Scheme.find({creator: req.user._id})
        // Throws a 404 error if no schemes are found
        if (!showSchemes) {
            return res.status(404).send("No schemes found")
        }
        // Returns all the user's schemes on success
        res.status(200).json(showSchemes)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Show all of a user's assessment schemes
const getOneScheme = async (req,res) => {
    try {
        // Returns a scheme based on its ObjectId, as long as the creator matches the ObjectId of the user
        const showScheme = await Scheme.find({_id: req.params._id, creator: req.user._id})
        // Throws a 404 error if no scheme is found
        if (!showScheme) {
            return res.status(404).send("Scheme not found")
        }
        res.status(200).json(showScheme)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Add a new scheme
const createScheme = async (req,res) => {
    const newScheme = new Scheme({
        mission_cards: req.body.mission_cards,
        assessment_cards: req.body.assessment_cards,
        creator: req.body.creator,
        ratings: [],
        visibility: req.body.visibility
    })
    try {
        // Saves the new scheme to the database
        const saveScheme = await newScheme.save()
        // Success status once saved, and returns a json object with the new scheme's information
        res.status(200).json(saveScheme)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Update a scheme
const updateScheme = async (req,res) => {
    try {
        const showScheme = await Scheme.findOne({_id: req.params._id, creator: req.user._id})
        // If the scheme has already been rated, and is public, return an error
        if (showScheme.ratings.length > 0 && showScheme.visibility === "public") {
            res.status(409).send("Scheme has already been rated, and so cannot be edited.")
        // If the scheme has been rated, but is not public, change its visibility and return an error
        } else if (showScheme.ratings.length > 0 && showScheme.visibility !== "public") {
            const updateScheme = await Scheme.updateOne({_id: showScheme._id}, {$set: {visibility: "public"}})
            res.status(409).send("Scheme has already been rated, and so cannot be edited.")
        // If it has not been rated, allow editing
        } else {
            // Update the scheme specified in the URL
            const updateScheme = await Scheme.updateOne({_id: req.params._id, creator: req.user._id}, {$set: {
                mission_cards: req.body.mission_cards,
                assessment_cards: req.body.assessment_cards,
                visibility: req.body.visibility
            }})
            // Returns a json response, and a success status
            res.status(200).json(updateScheme)
        }
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Rate a scheme
const rateScheme = async (req,res) => {
    try {
        // Push provided rating to the ratings array
        const rateScheme = await Scheme.updateOne({_id: req.params._id}, {$push: {ratings: req.body.rating}})

        // Find scheme
        const showScheme = await Scheme.findOne({_id: req.params._id})
        // Find number of ratings
        const count = showScheme.ratings.length

        // Calculate average rating
        let average = 0
        // Sum all ratings
        showScheme.ratings.forEach(rating => {
            average += rating
        })
        // Find average, rounded to nearest .5
        average = Math.round(average/count*2)/2

        // Set avg_rating to be the average
        const avgRateScheme = await Scheme.updateOne({_id: req.params._id}, {$set: {avg_rating: average}})

        // Return success status + message
        res.status(200).send("Successfully rated scheme")
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Delete a scheme
const deleteScheme = async (req,res) => {
    try {
        // Deletes the scheme whose id is specified in the URL, if the user is the creator of the scheme
        const removeScheme = await Scheme.deleteOne({_id: req.params._id, creator: req.user._id})
        // Retusn 200 success, as well as the id of the deleted scheme
        res.status(200).json({message: `Deleted the scheme with the id ${req.params._id}`})
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}


module.exports = {getAllPublicSchemes, getAllSchemes, getOneScheme, createScheme, updateScheme, rateScheme, deleteScheme}