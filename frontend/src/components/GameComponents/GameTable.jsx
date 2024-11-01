import React, { useEffect } from "react";
import { useGame } from "./GameContext";


const GameTable = () => {
  const { selectedMissionCards, assessmantTableCards } = useGame();

  useEffect(() => {
    // Accessing the shadow DOM element after component mounting
    const missionCards = document.querySelectorAll("game-super-mission-card");

    // Loop through each assessment card element
    missionCards.forEach((card) => {
      // Access shadow DOM and select elements with class ".card_blueprint"
      const shadowEl = card.shadowRoot.querySelector(".card_blueprint");

      // Check if shadow element exists before applying styles
      if (shadowEl) {
        shadowEl.style.width = "100%";
        shadowEl.style.height = "100%";
      }
    });
  }, []); // Dependency added here

  useEffect(() => {
    // Accessing the shadow DOM element after component mounting
    const shadowEl = document.querySelector("game-super-assessment-card").shadowRoot.querySelector(".card_blueprint");
    shadowEl.style.width = '100%';
  }, [assessmantTableCards]);

  return (
    <>
      <div className="mainGameMissionCardsContainer">
        <div className="missionCardsGrid">

          {selectedMissionCards && selectedMissionCards.length > 0 ? (
            selectedMissionCards.map((card) => (
              <div key={card._id} className="missionCardItem">
                <game-super-mission-card
                  card-name={card.card_name}
                  card-type={card.card_type}
                  card-description={card.card_description}
                  card-id={card.card_id}
                  card-icon={`http://localhost:5353/${card.card_icon}`}
                />
              </div>
            ))
          ) : (
            <>
            <div className="missionCardItem noMissionCardSelected">No mission card selected.</div>
            <div className="missionCardItem noMissionCardSelected">No mission card selected.</div>
            <div className="missionCardItem noMissionCardSelected">No mission card selected.</div>
            </>
          )}
        </div>
      </div>

      <div className="mainGameAssessmentCardsContainer">
        <div className="assessmentCardsGrid">
          {assessmantTableCards &&
            assessmantTableCards.map((card) => (
              <div key={card._id} className="assessmentCardItem">
                <game-super-assessment-card
                  card-name={card.card_name}
                  card-category={card.card_category}
                  card-type={card.card_type}
                  card-description={card.card_description}
                  card-details={card.card_details}
                  card-id={card.card_id}
                  card-icon={`http://localhost:5353/${card.card_icon}`}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default GameTable;
