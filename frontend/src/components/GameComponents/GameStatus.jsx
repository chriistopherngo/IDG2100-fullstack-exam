import React from "react";
import { useGame } from "./GameContext";
import { BsFillExclamationDiamondFill } from "react-icons/bs";

// simple component that displays the game status
const GameStatus = () => {
  const { gameStatus } = useGame();

  // displayes the game status based on the gameStatus state variable
  return (
    <>
      <p>{gameStatus}</p>
    </>
  );
};

export default GameStatus;
