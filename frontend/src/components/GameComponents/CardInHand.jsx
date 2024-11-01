const CardInHand = ({ cardInHand, cardRef }) => {
  return (
    <div>
      {cardInHand ? (
        <div className="cardInHand">
          <game-super-assessment-card
            ref={cardRef}
            card-name={cardInHand.card_name}
            card-category={cardInHand.card_category}
            card-type={cardInHand.card_type}
            card-description={cardInHand.card_description}
            card-id={cardInHand.card_id}
            card-details={cardInHand.card_details}
            card-icon={`http://localhost:5353/${cardInHand.card_icon}`}
          />
        </div>
      ) : (
        <div className="cardInHand">
          <div className="notDrawedACard">
            <game-super-assessment-card
              card-icon={`http://localhost:5353/uploads/icon-assessment.png`}
            />
            <div className="drawACard">DRAW A CARD TO PLAY!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardInHand;
