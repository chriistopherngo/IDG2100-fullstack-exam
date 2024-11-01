import React, { useState } from "react";
import CardManagement from "../CardManagment/CardManagment";
import "./EditCardsToggle.css";

// Toggle between assessment and mission cards
const EditCardsToggle = () => {
  const [cardType, setCardType] = useState("assessment");

  const handleEditAssessmentCards = () => {
    setCardType("assessment");
  };

  const handleEditMissionCards = () => {
    setCardType("mission");
  };

  return (
    <>
      <div className="table_or_card">
        <div
          onClick={handleEditAssessmentCards}
          className={cardType === "assessment" ? "selected_button" : "toggle_button"}
        >
          Assessment Cards
        </div>
        <div
          onClick={handleEditMissionCards}
          className={cardType === "mission" ? "selected_button" : "toggle_button"}
        >
          Mission Cards
        </div>
      </div>
      {/* binds key to card type to remount if it changes */}
      <CardManagement key={cardType} cardType={cardType} />
    </>
  );
};

export default EditCardsToggle;
