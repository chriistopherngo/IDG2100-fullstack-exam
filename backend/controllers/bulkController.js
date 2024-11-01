// Controller created from combining "bulkAddController.js" and "bulkEditController.js" from Oblig 3
// New from Oblig 3: bulk delete functionality

// Import dependencies
const AssessmentCard = require("../models/assessmentSchema")
const MissionCard = require("../models/missionSchema")

// Default icons
const { pickAssessmentIcon } = require("../utils/pickDefaultIcon")
const defaultMissionIcon = "uploads/icon-mission.png"

// json example from frontend
const assessmentJason = {
  card_ids: [1, 4, 6, 9, 14, 46, 67, 86],
  new_icon: "https://i.imgflip.com/6ej3bl.png", // or "uploads/icon-name"
}
const missionJason = {
  card_ids: [1, 3, 5, 7],
  new_icon: "https://i.imgflip.com/6ej3bl.png",
}
const deleteIDs = [101, 102, 103, 104, 105]

// Add assessment cards
const addAssessmentCards = async (req, res) => {
  try {
    // Converting JSON file to object
    // Source: https://stackoverflow.com/questions/64001893/parse-multipart-json-with-multer/64004724#64004724
    // Recieve json data from the request body
    const fileData = JSON.parse(req.file.buffer.toString())
    // const fileData = require("../../bulk-add-data/assessments-db.json") // use test data
    let assessmentArray = []
    // Loop through each card provided in the request and assign values to each field
    for (const card of fileData.cards) {
      const assessmentCard = new AssessmentCard({
        card_id: card["card-id"],
        card_type: card["card-type"],
        card_category: card["card-category"].toLowerCase(),
        card_name: card["card-name"],
        card_description: card["card-description"],
        card_details: card["card-details"],
        // If card-icon is specified in the data, use that, if not, call the pickAssessmentIcon function and pass the card category as an argument
        card_icon:
          card["card-icon"] || pickAssessmentIcon(card["card-category"]),
      })
      // Push the new card to the response array
      assessmentArray.push(assessmentCard)
      // Save the new card

      await assessmentCard.save()
    }

    // Send a success status and the array of cards
    res.status(200).send(assessmentArray)
  } catch (error) {
    // Catch block for badly formatted requests
    res.status(400).json({ message: error })
  }
}

// Add mission cards (logic is identical to assessment, except with different card fields)
const addMissionCards = async (req, res) => {
  try {
    const fileData = JSON.parse(req.file.buffer.toString())
    let missionArray = []
    // const fileData = require("../../bulk-add-data/missions-db.json") // use test data

    for (const card of fileData.cards) {
      const missionCard = new MissionCard({
        card_id: card["card-id"],
        card_type: card["card-type"],
        card_name: card["card-name"],
        card_description: card["card-description"],
        // If card-icon is specified in the data, use that, if not use the default icon defined earlier
        card_icon: card["card-icon"] || defaultMissionIcon,
      })

      missionArray.push(missionCard)
      await missionCard.save()
    }
    res.status(200).send(missionArray)
  } catch (error) {
    res.status(400).json({ message: error })
  }
}

// Edit assessment cards
const editAssessmentCards = async (req, res) => {
  let filePath
  if (req.files) {
    filePath = req.files[0].path
  }
  try {
    // Recieve json data from the request body
    const data = req.body

    for (let i = 0; i < data.card_id.length; i++) {
      await AssessmentCard.findOneAndUpdate(
        { card_id: data.card_id[i] },
        {
          $set: {
            card_icon: filePath || data.card_icon[i]
          },
        }
      )
    }

    // Send a success status and message
    res.status(200).send("Successfully updated the assessment cards")
  } catch (error) {
    // Catch block for badly formatted requests
    res.status(400).json({ message: error })
  }
}

// Edit mission cards (logic is identical to assessment)
const editMissionCards = async (req, res) => {
    let filePath
    if (req.files) {
      filePath = req.files[0].path
    }
    try {
      // Recieve json data from the request body
      const data = req.body
  
      for (let i = 0; i < data.card_id.length; i++) {
        await MissionCard.findOneAndUpdate(
          { card_id: data.card_id[i] },
          {
            $set: {
              card_icon: filePath || data.card_icon[i]
            },
          }
        )
      }
  
      // Send a success status and message
      res.status(200).send("Successfully updated the mission cards")
  } catch (error) {
    res.status(400).json({ message: error })
  }
}


// Exports the functions created in the controller
module.exports = {
  addAssessmentCards,
  addMissionCards,
  editAssessmentCards,
  editMissionCards,
}
