// Most code reused from Ola's Oblig 2 – also essentially identical to code covered in classes
// New from Oblig 3: "all" query parameter

// Import dependencies
const AssessmentCard = require("../models/assessmentSchema")
const MissionCard = require("../models/missionSchema")

// Controller for handling search requests
const search = async (req, res) => {
    try {
        // Defines constants based on the query parameters
        const cardType = req.query["card-type"]
        const cardCategory = req.query["card-category"]
        const allCards = req.query["all"]
        // Parses the random parameter as an integer
        const randomCount = parseInt(req.query.random) || 1
        // If the exclude parameter exists, parses it as json. If not, exclude is simply set to an empty array
        const exclude = req.query.exclude ? JSON.parse(req.query.exclude) : []

        let query = {}
        // Builds a query based on the provided criteria
        if (cardType) {
            query.card_type = cardType
        }
        if (cardCategory) {
            query.card_category = cardCategory
        }
        if (exclude.length > 0) {
            query.card_id = { $nin: exclude }
        }

        let cards = []
        // Performs a database query based on card type
        if (cardType === 'assessment') {
            cards = await AssessmentCard.find(query)
        } else if (cardType === 'mission') {
            cards = await MissionCard.find(query)
        } else {
            // Returns an error message if the card type does not exist
            return res.status(400).json({ error: 'Invalid card type' })
        }

        // If no cards match the criteria, returns an empty array
        if (cards.length === 0) {
            return res.json([])
        }

        // Returns all cards if the "all" query parameter is included
        if (allCards === "") {
            return res.json(cards)
        }

        // Randomly selects cards
        const selectedCards = []
        // While the length of the selected cards is lower than the desired amount, and there are more than 0 cards left to choose from...
        while (selectedCards.length < randomCount && cards.length > 0) {
            // pick a random card,
            const randomIndex = Math.floor(Math.random() * cards.length)
            // push it to the array of selected cards,
            selectedCards.push(cards[randomIndex])
            // and remove the card from the list of possible cards (this is done to avoid duplicate cards)
            cards.splice(randomIndex, 1)
        }

        // Return the selected cards as the response
        res.json(selectedCards)
    } catch (error) {
        // Catch block for badly formatted requests
        res.status(400).json({message: error})
    }
}


// Exports the functions created in the controller
module.exports = {search}