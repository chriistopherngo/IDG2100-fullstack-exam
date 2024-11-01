import { useEffect, useState, useRef } from "react";
import { useGame } from "./GameContext";
import instance from "../../utils/axios";
import "./Game.css";
import { useNavigate } from "react-router-dom";
import { MdOutlineExitToApp } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import GameTable from "./GameTable";
import GameStatus from "./GameStatus";
import Actions from "./Actions";
import CardInHand from "./CardInHand";

// Import utility functions
import { shuffle } from "../../utils/Shuffle";
import { useBeforeUnload } from "../../utils/BeforeUnload";
import { filterOutUsedCards } from "../../utils/FilterUsedCards";
import { sortTableAssessmentCards } from "../../utils/SortTableAssessmentCards";
import Loading from "../../utils/Loading";
import CardDecks from "./CardDecks";
import CurrentPlayerStatus from "./CurrentplayerStatus";
import TurnsRemaining from "./TurnsRemaining";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const Game = () => {
  const {
    players,
    turnCount,
    setTurnCount,
    isTurns,
    setGameStatus,
    assessmantTableCards,
    setAssessmentTableCards,
    setWonGame,
  } = useGame();
  const [loading, setLoading] = useState(true);
  const [cardInHand, setCardInHand] = useState(null);
  const [triggerQuit, setTriggerQuit] = useState(false);

  const [showVotePanel, setShowVotePanel] = useState(false);
  const [showFinalVotePanel, setShowFinalVotePanel] = useState(false);
  const [votesForQuitting, setVotesForQuitting] = useState(0);
  const [votesAgainstQuitting, setVotesAgainstQuitting] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  const [whoIsAssessed, setWhoIsAssessed] = useState([]);
  const [theAssessor, setTheAssessor] = useState([]);
  const [assessmentArtefact, setAssessmentArtefact] = useState([]);
  const [assessmentFormat, setAssessmentFormat] = useState([]);
  const [context, setContext] = useState([]);
  const [assessmentTiming, setAssessmentTiming] = useState([]);

  const [currentTurn, setCurrentTurn] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  let finalVote = false;

  const navigate = useNavigate();
  const cardRef = useRef(null);
  useBeforeUnload();

  "is turns:", isTurns;

  function populateCardsByCategory(cards) {
    // Create arrays for each category
    const WhoIsAssessed = [];
    const TheAssessor = [];
    const AssessmentArtefact = [];
    const AssessmentFormat = [];
    const Context = [];
    const AssessmentTiming = [];

    // Loop through all cards and sort them into their respective categories
    cards.forEach((card) => {
      switch (card.card_category) {
        case "who is assessed":
          WhoIsAssessed.push(card);
          break;
        case "the assessor":
          TheAssessor.push(card);
          break;
        case "assessment artefact":
          AssessmentArtefact.push(card);
          break;
        case "assessment format":
          AssessmentFormat.push(card);
          break;
        case "context":
          Context.push(card);
          break;
        case "assessment timing":
          AssessmentTiming.push(card);
          break;
        default:
          "No category found";
      }
    });

    // Update the state with the sorted cards
    setWhoIsAssessed(WhoIsAssessed);
    setTheAssessor(TheAssessor);
    setAssessmentArtefact(AssessmentArtefact);
    setAssessmentFormat(AssessmentFormat);
    setContext(Context);
    setAssessmentTiming(AssessmentTiming);
  }

  useEffect(() => {
    instance
      .get("/api/assessment")
      .then((response) => {
        // Shuffle the cards and sort them into the assessmentTableCards array
        const shuffledCards = shuffle(response.data);
        const assessmentCardsOnTable = sortTableAssessmentCards(shuffledCards);
        // Update the state with the sorted cards
        setAssessmentTableCards(assessmentCardsOnTable);
        // Filter out the cards that are already on the table
        const filteredCards = filterOutUsedCards(
          shuffledCards,
          assessmentCardsOnTable
        );
        // Populate and sort the card decks with the remaining cards by category
        populateCardsByCategory(filteredCards);
      })
      .catch((error) => {
        console.error(error);
        setGameStatus("An error occurred while fetching the cards");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setGameStatus("Choose a card from the decks \u2198");
      });
  }, []);

  // call the turnHandler() function whenever the currentPlayer state changes
  useEffect(() => {
    turnHandler();
  }, [currentPlayer]);

  const turnHandler = () => {
    // If the current player is the last player in the game...
    if (currentPlayer > players.length - 1) {
      // Reset the current player
      resetCurrentPlayer();
      // And increment the current turn by 1
      setCurrentTurn(currentTurn + 1);

      // If the game uses max turns, check if there are any turns left
      if (isTurns === true && turnCount > 1) {
        // Decrement turn count if there are
        decrementTurnCount();
      } else if (isTurns === true && turnCount === 1) {
        // Change the "finalVote" variable to true and call a vote
        finalVote = true;
        handleCallVote();
      }
    }
  };

  // Increment the currently acting player by 1
  const incrementCurrentPlayer = () => {
    setCurrentPlayer(currentPlayer + 1);
  };

  // Reset the currently acting player
  const resetCurrentPlayer = () => {
    setCurrentPlayer(0);
  };

  // Decrement turn count by 1
  const decrementTurnCount = () => {
    setTurnCount(turnCount - 1);
  };

  // Needed to update the icon in the cardInHand, else it wont render correct icon
  useEffect(() => {
    if (cardRef.current && cardInHand) {
      // Access the custom component's instance
      const cardElement = cardRef.current.shadowRoot.querySelector(
        ".card_blueprint .category_icon img"
      );

      // Update the card-icon attribute with the new value
      cardElement.removeAttribute("src");
      cardElement.setAttribute(
        "src",
        `http://localhost:5353/${cardInHand.card_icon}`
      );
    }
  }, [cardInHand]);

  if (loading) {
    return <Loading />;
  }

  const handleCardClick = (categoryArray) => {
    if (!cardInHand) {
      // Check if there are any cards left in the category array
      if (categoryArray.length === 0) {
        setGameStatus("No more cards in this category");
        return;
      }
      // if there are no cards in hand, pop a card from the category array
      const cardFromArray = categoryArray.pop();
      // set the card in hand
      setCardInHand(cardFromArray);

      // set the game status
      setGameStatus(`You picked a card from ${cardFromArray.card_category}`);
    } else {
      setGameStatus(`\u26D4 You already have a card in hand, make an action! `);
      return;
    }
  };

  const handleAction = (action) => {
    // Check if there is a card in hand
    if (cardInHand) {
      // Check and perform the action based on the action type
      if (action === "replace") {
        replaceCard();
      }

      if (action === "pass") {
        pass();
      }

      if (action === "remove") {
        removeFromGame();
      }
    } else {
      // If there is no card in hand, set the game status to inform the player
      setGameStatus(
        `\u26D4 ${players[currentPlayer]}! You need to choose a card first!`
      );
      return;
    }

    incrementCurrentPlayer();
  };

  // Function to handle the pass action
  function pass() {
    // Check the card category and add the card back to the correct array
    switch (cardInHand.card_category) {
      case "who is assessed":
        setWhoIsAssessed([cardInHand, ...whoIsAssessed]);
        break;
      case "the assessor":
        setTheAssessor([cardInHand, ...theAssessor]);
        break;
      case "assessment artefact":
        setAssessmentArtefact([cardInHand, ...assessmentArtefact]);
        setTheAssessor([cardInHand, ...theAssessor]);
        break;
      case "assessment format":
        setAssessmentFormat([cardInHand, ...assessmentFormat]);
        break;
      case "context":
        setContext([cardInHand, ...context]);
        break;
      case "assessment timing":
        setAssessmentTiming([cardInHand, ...assessmentTiming]);
        break;
      default:
        break;
    }
    // Set the game status and reset the card in hand
    setGameStatus(
      `${players[currentPlayer]} passed on a "${cardInHand.card_category}" card`
    );
    setCardInHand(null);
  }

  function replaceCard() {
    // Find the index of the card in the assessmentTableCards array and replace it with the cardInHand
    const assessmentCardIndex = assessmantTableCards.findIndex(
      (card) => card.card_category === cardInHand.card_category
    );
    // Create a new array with the replaced card and update the state
    const newTableCards = [...assessmantTableCards];
    newTableCards[assessmentCardIndex] = cardInHand;
    setAssessmentTableCards(newTableCards);
    // Set the game status and reset the card in hand
    setGameStatus(
      `${players[currentPlayer]} replaced a "${cardInHand.card_category}" card`
    );
    setCardInHand(null);
  }

  function removeFromGame() {
    // Set car in hand to null to remove it from the category array
    setCardInHand(null);
    setGameStatus(
      `${players[currentPlayer]} removed a "${cardInHand.card_category}" card`
    );
  }

  // Function to handle the exit game action
  const handleExitGame = () => {
    setTriggerQuit(true);
  };

  // Function to handle the cancel quit action
  const handleCancelQuit = () => {
    setTriggerQuit(false);
  };

  // return to the game menu screen
  const handleConfirmQuit = () => {
    navigate("/main-game");
  };

  // __________________________ Vote Logic __________________________

  const handleCallVote = () => {
    if (cardInHand) {
      toast.info("Can't vote when card drawn");
      return;
    }

    if (players.length === 1 && !finalVote) {
      // player wins if they are the only player and the final vote is not called
      setWonGame(true);
      navigate("/game/game-over");
    } else if (finalVote) {
      setShowVotePanel(true);
    } else {
      // Reset quitting votes count
      setVotesForQuitting(0);
      // Reset not quitting votes count
      setVotesAgainstQuitting(0);
      // Reset total votes count
      setTotalVotes(0);
      setShowVotePanel(true);
    }
  };

  isTurns, turnCount;

  const checkVoteStatus = (totalVotes, votesForQuitting) => {
    if (totalVotes === players.length) {
      // Check if more than 50% of the players want to quit
      if (votesForQuitting > players.length / 2) {
        setGameStatus("The game has ended");
        toast.error("The game has ended");
        setWonGame(true);
        navigate("/game/game-over");
      } else {
        if (isTurns && turnCount <= 1) {
          navigate("/game/game-over");
        }
        setGameStatus("Game continues");
        toast.success("Game continues");
        setVotesAgainstQuitting(0);
        setVotesForQuitting(0);
        setTotalVotes(0);
        setShowVotePanel(false);
        incrementCurrentPlayer();
      }
    }
  };

  "console log outside function", totalVotes;

  const handleVoteFinish = () => {
    // Increment the votes for quitting
    setVotesForQuitting((prevQuitAmount) => {
      const newVotesForQuitting = prevQuitAmount + 1;
      setTotalVotes((tv) => {
        const newTotalVotes = tv + 1;
        checkVoteStatus(newTotalVotes, newVotesForQuitting);
        return newTotalVotes;
      });
      return newVotesForQuitting;
    });
  };

  const handleVoteKeepPlaying = () => {
    // Increment the votes against quitting
    setVotesAgainstQuitting((vaq) => {
      const newVotesAgainstQuitting = vaq + 1;
      setTotalVotes((tv) => {
        const newTotalVotes = tv + 1;
        checkVoteStatus(newTotalVotes, votesForQuitting);
        return newTotalVotes;
      });
      return newVotesAgainstQuitting;
    });
  };

  return (
    <>
      <div className="game-status">
        <GameStatus />
      </div>

      {players.length > 1 && (
        <div className="current-player-status">
          <CurrentPlayerStatus currentPlayer={players[currentPlayer]} />
        </div>
      )}

      {isTurns && <TurnsRemaining turnsRemaining={turnCount} />}

      <ToastContainer
        className={"toastContainer"}
        position="bottom-left"
        autoClose={2500}
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
      />

      {showVotePanel && (
        <div className="modal confirmation">
          <div className="vote-container">
            <p className="vote-main-title">End the game?</p>
            <p className="vote-sec-title">
              {players[totalVotes]}'s turn to vote!
            </p>
            <div className="vote-container-inner">
              <button
                className="vote-button btn-false"
                onClick={() => handleVoteKeepPlaying()}
              >
                {players.length > 1 && isTurns && turnCount <= 1
                  ? "Unhappy with the results"
                  : "Keep playing"}
              </button>
              <button
                className="vote-button"
                onClick={() => handleVoteFinish()}
              >
                {players.length > 1 && isTurns && turnCount <= 1
                  ? "Happy with the results"
                  : "Finish Game"}
              </button>
            </div>
            <div className="vote-container-inner">
              <p>{votesAgainstQuitting} votes to keep playing</p>
              <p>{votesForQuitting} votes to finish game</p>
            </div>
          </div>
        </div>
      )}

      {showFinalVotePanel && (
        <div className="modal confirmation">
          <div className="vote-container">
            <p className="vote-main-title">Are you happy with the scheme?</p>
            <div className="vote-container-inner">
              <button
                className="vote-button btn-false"
                onClick={() => navigate("/game/game-over")}
              >
                No
              </button>
              <button
                className="vote-button"
                onClick={() => {
                  setWonGame(true);
                  navigate("/game/game-over");
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {triggerQuit && (
        <ConfirmationModal
          message="Quit game?"
          cancelMessage="No, keep playing"
          confirmMessage="Yes, quit game"
          onCancel={handleCancelQuit}
          onConfirm={handleConfirmQuit}
        />
      )}

      <div className="container">
        <div className="HandAndActions">
          <div>
            <div className="playersInGame">
              {players.map((player, index) => (
                
                  <div
                    key={index}
                    className={
                      index == currentPlayer ? "player currentPlayer" : "player"
                    }
                  >
                    {player}
                  </div>
                
              ))}
            </div>

            <CardDecks
              onCardClick={handleCardClick}
              whoIsAssessed={whoIsAssessed}
              context={context}
              theAssessor={theAssessor}
              assessmentArtefact={assessmentArtefact}
              assessmentFormat={assessmentFormat}
              assessmentTiming={assessmentTiming}
            />
          </div>

          <CardInHand cardInHand={cardInHand} cardRef={cardRef} />
          <Actions
            onCallAction={handleAction}
            onCallVote={handleCallVote}
            cardInHand={!!cardInHand}
          />
        </div>
        <div className="MainGame">
          <div className="exitGameContainer" onClick={handleExitGame}>
            <div className="exitGame">
              <span>
                <MdOutlineExitToApp size={50} />
              </span>
            </div>
            <div>Quit</div>
          </div>

          <GameTable />
        </div>
      </div>
    </>
  );
};

export default Game;
