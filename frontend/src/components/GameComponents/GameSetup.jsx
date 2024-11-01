import React, { useState, useEffect, useLayoutEffect } from "react";
import instance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { useGame } from "./GameContext";
import "./Game.css";

const GameSetup = () => {
  // get the state and functions from the GameContext
  const {
    players,
    setPlayers,
    turnCount,
    setTurnCount,
    selectedMissionCards,
    setSelectedCard,
    isTurns,
    setIsTurns,
  } = useGame();

  const [playerCount, setPlayerCount] = useState(1);
  const [missionCards, setMissionCards] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // When navigated to page, scroll to top.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch mission cards from the database
  useEffect(() => {
    instance
      .get("http://localhost:5353/api/mission")
      .then((res) => {
        setMissionCards(res.data);
      })
      .catch((error) => console.error(error));

    document.body.classList.add("no-scroll");

    return () => {
      // Remove class from body when component unmounts
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const handlePlayerCountChange = (e) => {
    const newCount = e.target.value;
    const newPlayers = [...players];

    if (newCount > players.length) {
      // If increasing player count, add empty strings for new players
      for (let i = players.length; i < newCount; i++) {
        newPlayers.push("");
      }
    } else {
      // If decreasing player count, remove extra players
      newPlayers.length = newCount;
    }

    setPlayerCount(newCount);
    setPlayers(newPlayers);
  };

  // Function to handle player name changes
  const handlePlayerNameChange = (index, e) => {
    const newPlayers = [...players];
    newPlayers[index] = e.target.value;
    setPlayers(newPlayers);
  };

  const displayPlayerInputs = () => {
    // Map through players array and display input for each player
    return players.map((name, index) => (
      <div key={index} className="playerNameInput">
        <input
          required
          type="text"
          id={`player${index}`}
          value={name}
          onChange={(e) => handlePlayerNameChange(index, e)}
          placeholder={`Add Player ${index + 1} name`}
        />
      </div>
    ));
  };

  function submitGameInfo() {
    // Check if all player names are entered
    if (players.some((player) => player === "")) {
      setError("Please enter all player names");
      return;
    }

    // Check if turn count is between 5 and 30
    if (isTurns == true && (turnCount < 5 || turnCount > 30)) {
      setError("The amount of turns must be between 5 and 30");
      return;
    }

    // Check if 3 mission cards are selected
    if (selectedMissionCards.length !== 3) {
      const container = document.querySelector(".totalCardsSelectedContainer");
      container.classList.add("errorAnimation");

      // Delay the removal of the errorAnimation class
      setTimeout(() => {
        container.classList.remove("errorAnimation");
      }, 500); // Adjust the delay time as needed

      return;
    }

    setError("");
    navigate("/game");
  }

  // toggle between unlimited turns and predefined amount of turns
  const handleTurnType = () => {
    setIsTurns(!isTurns);
  };

  // Function to assign predefined amount of turns
  const handleTurnCount = (e) => {
    setTurnCount(e.target.value);
  };

  // function to handle card selection
  const handleCardSelect = (card) => {
    const index = selectedMissionCards.findIndex(
      (selected) => selected._id === card._id
    );

    // Check if 3 cards are already selected
    if (selectedMissionCards.length < 3) {
      // If index is -1, card is not selected
      if (index === -1) {
        setSelectedCard([...selectedMissionCards, card]);
      } else {
        // If card is already selected, remove it
        const updatedSelectedCard = selectedMissionCards.filter(
          (selected) => selected._id !== card._id
        );
        setSelectedCard(updatedSelectedCard);
      }
    } else {
      // If card is not already selected and limit is reached, don't add it
      if (index === -1) {
        return;
      } else {
        // If card is already selected, remove it
        const updatedSelectedCard = selectedMissionCards.filter(
          (selected) => selected._id !== card._id
        );
        setSelectedCard(updatedSelectedCard);
      }
    }
  };

  return (
    <>
      <div className="preGameSetupLayout">
        <div>
          <div className="preGameSetupContainer">
            <div className="preGameSetup">
              <p>How many players?</p>
              <div className="select-container pregame">
                <select
                  value={playerCount}
                  onChange={handlePlayerCountChange}
                  name="playerCount"
                  id="playerCount"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>
              <div className="playerNameInputContainer">
                Players
                <div className="playerNameInputFlex">
                  {displayPlayerInputs()}
                </div>
                {error && <p className="error">{error}</p>}
              </div>
              <div className="turnTypeContainer">
                <p>Select Turn Amount</p>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="unlimited"
                    name="toggle_turns"
                    value={isTurns}
                    onChange={handleTurnType}
                    checked={isTurns === false}
                  />
                  <label htmlFor="html">Unlimited turns</label>
                </div>

                <div className="radio-option">
                  <input
                    type="radio"
                    id="predef"
                    name="toggle_turns"
                    value={!isTurns}
                    onChange={handleTurnType}
                  />
                  <label htmlFor="css">Predefined amount</label>
                </div>

                {isTurns && (
                  <>
                    <div className="maxRoundsContainer">
                      Max rounds:
                      <input
                      placeholder="5-30"
                        type="number"
                        id="turns"
                        name="turns"
                        min="5"
                        max="30"
                        value={turnCount}
                        onChange={handleTurnCount}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="preGameSetupLayoutCards">
          <div className="totalCardsSelectedContainer">
            <div>
              <span className="text">Choose mission cards</span>
            </div>
            <div>
              <span>
                Cards selected:{" "}
                <span className="amountSelected">
                  {selectedMissionCards.length} / 3
                </span>
              </span>
            </div>
          </div>
          <div className="preGameMissionCardsContainer_wrapper">
            <div className="preGameMissionCardsContainer">
              {missionCards.map((card) => (
                <div
                  key={card._id}
                  className={` missionCard ${selectedMissionCards.find((selected) => selected._id === card._id) ? "selectedCard" : ""}`}
                >
                  <super-mission-card
                    className="playCardMission"
                    id={card._id}
                    card-id={card.card_id}
                    card-type={card.card_type}
                    card-name={card.card_name}
                    card-description={card.card_description}
                    card-icon={`http://localhost:5353/${card.card_icon}`}
                    onClick={() => handleCardSelect(card)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <>
        <div className="playButtonContainer">
          <div
            className={`playButton ${selectedMissionCards.length === 3 && (isTurns ? turnCount >= 5 && turnCount <= 30 : true) && !players.some((player) => player === "") ? "startGame" : ""}`}
            onClick={() => submitGameInfo()}
          >
            START GAME
          </div>
        </div>
      </>
    </>
  );
};

export default GameSetup;
