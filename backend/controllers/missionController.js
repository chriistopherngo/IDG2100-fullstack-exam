// Most code reused from Ola's Oblig 2 – also essentially identical to code covered in classes
// New from Oblig 3: more clear and descriptive error messages

// Import dependencies
const MissionCard = require("../models/missionSchema")

// Show all mission cards
const getAllMissionCards = async (req, res) => {
    try {
        // Searches database for all mission cards
        const showMissionCards = await MissionCard.find()
        // Throws a 404 error if no cards are found
        if (!showMissionCards) {
            return res.status(404).send("No cards found")
        }
        // Returns all the cards on success
        res.status(200).json(showMissionCards)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Show a specific mission card
const getOneMissionCard = async (req, res) => {
    try {
        // Finds a card based on the card_id given in the request
        const showMissionCard = await MissionCard.find({ card_id: req.params.card_id })
        // Throws a 404 error if no card is found
        if (!showMissionCard) {
            return res.status(404).send("Card not found")
        }
        res.status(200).json(showMissionCard)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}
// Add a new mission card
const createMissionCard = async (req, res) => {
    let filePath
    if (req.file){
         filePath = req.file.path
    } else {
        filePath = "uploads/icon-mission.png"
    }
    
    // Creates a new card using the provided data
    const newMissionCard = new MissionCard({
        card_id: req.body.card_id,
        card_type: req.body.card_type,
        card_name: req.body.card_name,
        card_description: req.body.card_description,
        card_icon: filePath
    })
    try {
        // Saves the new card to the database
        const saveMissionCard = await newMissionCard.save()
        // Success status once saved, and returns a json object with the new card's information
        res.status(200).json(saveMissionCard)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Update a mission card
const updateMissionCard = async (req, res) => {
    let filePath
    if (req.file){
        filePath = req.file.path
    }

    try {
        // Update the card specified in the URL
        const updateMissionCard = await MissionCard.updateOne({ card_id: req.params.card_id }, { $set: {
            card_id: req.body.card_id,
            card_type: req.body.card_type,
            card_name: req.body.card_name,
            card_description: req.body.card_description,
            card_icon: filePath
        }})
        // Returns a json response, and a success status
        res.status(200).json(updateMissionCard)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}

// Delete a mission card
const deleteMissionCard = async (req, res) => {
    try {
        // Deletes the card whose id is specified in the URL
        const removeMissionCard = await MissionCard.deleteOne({ card_id: req.params.card_id })
        // Returns 200 success, as well as the id of the deleted card
        res.status(200).json({ message: `Deleted the mission card with the id ${req.params.card_id}` })
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({ message: error })
    }
}


// Exports the functions created in the controller
module.exports = {getAllMissionCards, getOneMissionCard, createMissionCard, updateMissionCard, deleteMissionCard}