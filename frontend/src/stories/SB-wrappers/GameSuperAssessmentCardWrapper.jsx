
import '../../web-component/game-super-assessment-card'

const GameSuperAssessmentCardWrapper = ({
  cardId,
  cardCategory,
  cardName,
  cardDescription,
  cardDetails,
  cardIcon,
}) => {

  return (
    <game-super-assessment-card
      card-id={cardId}
      card-category={cardCategory}
      card-name={cardName}
      card-description={cardDescription}
      card-details={cardDetails}
      card-icon={cardIcon}
    ></game-super-assessment-card>
  );
};

export default GameSuperAssessmentCardWrapper;
