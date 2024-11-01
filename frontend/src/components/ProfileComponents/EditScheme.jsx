import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../utils/Loading";
import Scheme from "../SchemeManagement/Scheme";
import instance from "../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getConfig from "../../utils/getConfig";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const EditScheme = ({
  schemeAssessmentCards,
  schemeMissionCards,
  scheme,
  onEditScheme,
  setSchemes,
}) => {
  const { token } = useAuth();
  const baseURL = "http://localhost:5353";

  const [newScheme, setNewScheme] = useState(scheme);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate();

  const assessmentCardClick = (card) => {
    setNewScheme((prevScheme) => {
      // Create a new array to hold the updated assessment cards
      let newAssessmentCards;

      // Check if the card ID is already in the assessment_cards array
      if (prevScheme.assessment_cards.includes(card._id)) {
        // If it exists, remove it
        newAssessmentCards = prevScheme.assessment_cards.filter(
          (c) => c !== card._id // c = card
        );
      } else {
        // Check if the array already has 6 cards
        if (prevScheme.assessment_cards.length >= 6) {
          return prevScheme;
        }

        // If it doesn't exist, add it
        newAssessmentCards = [...prevScheme.assessment_cards, card._id];
      }

      // Return the new scheme with the updated assessment_cards array
      return {
        ...prevScheme,
        assessment_cards: newAssessmentCards,
      };
    });
  };

  const missionCardClick = (card) => {
    setNewScheme((prevScheme) => {
      // Create a new array to hold the updated mission cards
      let newMissionCards;

      // Check if the card ID is already in the array
      if (prevScheme.mission_cards.includes(card._id)) {
        // If it exists, remove it
        newMissionCards = prevScheme.mission_cards.filter(
          (c) => c !== card._id
        );
      } else {
        // Check if the array already has 3 cards
        if (prevScheme.mission_cards.length >= 3) {
          return prevScheme;
        }

        // If it doesn't exist, add it
        newMissionCards = [...prevScheme.mission_cards, card._id];
      }

      // Return the new scheme with the updated array
      return {
        ...prevScheme,
        mission_cards: newMissionCards,
      };
    });
  };

  const deleteScheme = async () => {
    await instance
      .delete(`/api/scheme/${newScheme._id}/`, getConfig(token))
      .then(() => {
        setSchemes((prevSchemes) => {
          // Create a new array to hold the updated schemes
          const newSchemes = [...prevSchemes];

          // Find the index of the scheme that was deleted
          const index = newSchemes.findIndex(
            (scheme) => scheme._id === newScheme._id
          );

          // Remove the scheme from the array
          newSchemes.splice(index, 1);

          // Return the new array with the deleted scheme removed
          return newSchemes;
        });
        onEditScheme();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete scheme.");
      });
  };

  const updateScheme = (visiblity) => {
    // define the payload
    const schemeInfo = {
      mission_cards: newScheme.mission_cards,
      assessment_cards: newScheme.assessment_cards,
      visibility: visiblity,
    };

    // Make a PUT request to update the scheme with the new information
    instance
      .put(`/api/scheme/${newScheme._id}/`, schemeInfo, getConfig(token))
      .then(() => {
        if (visiblity === "private") {
          toast.success("Scheme updated!");
        } else {
          toast.success("Scheme updated and made public!");
        }
        setSchemes((prevSchemes) => {
          // Create a new array to hold the updated schemes
          const newSchemes = [...prevSchemes];

          // Find the index of the scheme that was updated
          const index = newSchemes.findIndex(
            (scheme) => scheme._id === newScheme._id
          );

          // Update the scheme in the array
          newSchemes[index] = {
            ...newSchemes[index],
            ...schemeInfo,
          };

          // Return the new array with the updated scheme
          return newSchemes;
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 409) {
          toast.error(
            "Scheme has already been rated, and so cannot be edited."
          );
        }
      });
  };

  return (
    <>
      <div className="edit-scheme-container">
        <ToastContainer position="bottom-right" theme="colored" />

        <div className="edit-scheme-cards">
          <button onClick={onEditScheme} className="scheme_btns quit">
            Quit edit menu
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "1em",
            }}
          >
            <button
              onClick={() => updateScheme("public")}
              className="scheme_btns save"
            >
              Save and make Public
            </button>
            <button
              onClick={() => updateScheme("private")}
              className="scheme_btns save"
            >
              Save scheme
            </button>

            <button
              onClick={() => {
                setShowConfirmation(true);
              }}
              className="scheme_btns delete"
            >
              Delete scheme
            </button>
          </div>

          {showConfirmation && (
            <ConfirmationModal
              message="Are you sure you want to delete this scheme?"
              cancelMessage="No, go back"
              confirmMessage="Yes, delete scheme"
              onCancel={() => {
                setShowConfirmation(false);
              }}
              onConfirm={() => {
                deleteScheme();
              }}
            />
          )}

          <div
            className="edit-cards"
            style={{ borderRight: "1px solid black" }}
          >
            {schemeMissionCards.map((card) => (
              <div
                key={card._id}
                className={`card-wrapper ${newScheme.mission_cards.includes(card._id) ? "EXISTS" : ""}`}
                onClick={() => missionCardClick(card)}
              >
                <game-super-mission-card
                  key={card._id}
                  card-id={card.card_id}
                  card-type={card.card_type}
                  card-name={card.card_name}
                  card-description={card.card_description}
                  card-icon={`${baseURL}/${card.card_icon}`}
                />
              </div>
            ))}
          </div>
          <div
            className="edit-cards"
            style={{ borderRight: "1px solid black" }}
          >
            {schemeAssessmentCards.map((card) => (
              <div
              key={card._id}
                className={`card-wrapper ${newScheme.assessment_cards.includes(card._id) ? "EXISTS" : ""}`}
                onClick={() => assessmentCardClick(card)}
              >
                <game-super-assessment-card
                  key={card._id}
                  card-id={card.card_id}
                  card-category={card.card_category}
                  card-details={card.card_details}
                  card-type={card.card_type}
                  card-name={card.card_name}
                  card-description={card.card_description}
                  card-icon={`${baseURL}/${card.card_icon}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="edit-scheme-panel">
          <div className="schemes">
            <h2>New Scheme</h2>
            <Scheme
              scheme={newScheme}
              index={newScheme._id}
              assessmentCards={schemeAssessmentCards}
              missionCards={schemeMissionCards}
              dontShowRating
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditScheme;
