// Most code reused from Ola's Oblig 2 – also essentially identical to code covered in classes
// New from Oblig 3: more clear and descriptive error messages

// Import dependencies
const AssessmentCard = require("../models/assessmentSchema")
const {pickAssessmentIcon} = require("../utils/pickDefaultIcon")


// Show all assessment cards
const getAllAssessmentCards = async (req,res) => {
    try {
        // Searches database for all assessment cards
        const showAssessmentCards = await AssessmentCard.find()
        // Throws a 404 error if no cards are found
        if (!showAssessmentCards) {
            return res.status(404).send("No cards found")
        }
        // Returns all the cards on success
        res.status(200).json(showAssessmentCards)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Show a specific assessment card
const getOneAssessmentCard = async (req,res) => {
    try {
        // Finds a card based on the card_id given in the request
        const showAssessmentCard = await AssessmentCard.find({card_id: req.params.card_id})
        // Throws a 404 error if no card is found
        if (!showAssessmentCard) {
            return res.status(404).send("Card not found")
        }
        res.status(200).json(showAssessmentCard)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Add a new assessment card
const createAssessmentCard = async (req,res) => {
    let filePath
    if (req.file){
        filePath = req.file.path
    } else {
        filePath = pickAssessmentIcon(req.body.card_category)
    }
    // Creates a new card using the provided data
    const newAssessmentCard = new AssessmentCard({
        card_id: req.body.card_id,
        card_type: req.body.card_type,
        card_category: req.body.card_category,
        card_name: req.body.card_name,
        card_description: req.body.card_description,
        card_details: req.body.card_details,
        card_icon: filePath
    })
    try {
        // Saves the new card to the database
        const saveAssessmentCard = await newAssessmentCard.save()
        // Success status once saved, and returns a json object with the new card's information
        res.status(200).json(saveAssessmentCard)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Update an assessment card
const updateAssessmentCard = async (req,res) => {
    let filePath
    if (req.file){
        filePath = req.file.path
    }
    
    try {
        // Update the card specified in the URL
        const updateAssessmentCard = await AssessmentCard.findOneAndUpdate({card_id: req.params.card_id}, {$set: {
            card_id: req.body.card_id,
            card_type: req.body.card_type,
            card_category: req.body.card_category,
            card_name: req.body.card_name,
            card_description: req.body.card_description,
            card_details: req.body.card_details,
            card_icon: filePath
    }})
        // Returns a json response, and a success status
        res.status(200).json(updateAssessmentCard)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}

// Delete an assessment card
const deleteAssessmentCard = async (req,res) => {
    try {
        // Deletes the card whose id is specified in the URL
        const removeAssessmentCard = await AssessmentCard.deleteOne({card_id: req.params.card_id})
        // Returns 200 success, as well as the id of the deleted card
        res.status(200).json({message: `Deleted the assessment card with the id ${req.params.card_id}`})
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}


// Exports the functions created in the controller
module.exports = {getAllAssessmentCards, getOneAssessmentCard, createAssessmentCard, updateAssessmentCard, deleteAssessmentCard}