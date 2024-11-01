import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

// Define the Provider component
export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([""]);
  const [turnCount, setTurnCount] = useState(null);
  const [selectedMissionCards, setSelectedCard] = useState([]);
  const [isTurns, setIsTurns] = useState(false);
  const [gameStatus, setGameStatus] = useState("Loading...");
  const [assessmantTableCards, setAssessmentTableCards] = useState([]);
  const [wonGame, setWonGame] = useState(false);


  // The value object that the provider will expose
  const value = {
    players,
    setPlayers,
    turnCount,
    setTurnCount,
    selectedMissionCards,
    setSelectedCard,
    isTurns,
    setIsTurns,
    gameStatus,
    setGameStatus,
    assessmantTableCards,
    setAssessmentTableCards,
    wonGame,
    setWonGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
