import React, { useEffect } from 'react';
import '../../web-component/game-super-mission-card'

const GameSuperMissionCardWrapper = ({
  cardId,
  cardType,
  cardName,
  cardDescription,
  cardIcon,
}) => {

  return (
    <game-super-mission-card
      card-id={cardId}
      card-type={cardType}
      card-name={cardName}
      card-description={cardDescription}
      card-icon={cardIcon}
    ></game-super-mission-card>
  );
};

export default GameSuperMissionCardWrapper;
