import React from "react";

const Scheme = ({
  scheme,
  index,
  assessmentCards,
  missionCards,
  dontShowRating,
}) => {
  const baseURL = "http://localhost:5353";
  return (
    <div className="assessment_scheme" key={index}>
      {!dontShowRating && (
        <div className="scheme_score">
          Average score: {scheme.avg_rating}
          <br />
          Number of ratings: {scheme.ratings.length}
        </div>
      )}
      <div className="scheme_cards">
        <div className="mission_cards">
          {scheme.mission_cards.map((card, i) => {
            const missionCardIndex = missionCards.findIndex(
              (item) => item._id === card
            );
            const missionCard = missionCards[missionCardIndex];
            if (missionCard) {
              return (
                <div key={missionCard._id}>
                  <div className="hover_card"></div>
                  <div>
                    <game-super-mission-card
                      key={i}
                      card-id={missionCard.card_id}
                      card-type={missionCard.card_type}
                      card-name={missionCard.card_name}
                      card-description={missionCard.card_description}
                      card-icon={`${baseURL}/${missionCard.card_icon}`}
                    />
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="assessment_cards">
          {scheme.assessment_cards.map((card, i) => {
            const assessmentCardIndex = assessmentCards.findIndex(
              (item) => item._id === card
            );
            const assessmentCard = assessmentCards[assessmentCardIndex];
            if (assessmentCard) {
              return (
                <div key={assessmentCard._id}>
                  <div className="hover_card"></div>
                  <div>
                    <game-super-assessment-card
                      key={i}
                      card-id={assessmentCard.card_id}
                      card-category={assessmentCard.card_category}
                      card-name={assessmentCard.card_name}
                      card-description={assessmentCard.card_description}
                      card-details={assessmentCard.card_details}
                      card-icon={`${baseURL}/${assessmentCard.card_icon}`}
                    />
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Scheme;
