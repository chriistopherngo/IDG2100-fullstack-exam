import { useNavigate } from "react-router-dom";

const MainGame = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="main-game-container">
        <div className="card-img-container">
          <h1>The SUPER Assessor v2.0</h1>

          <img
            src="/img/game-img.png"
            alt="image of two assessment cards and one mission card laying side by side"
          />
        </div>
        <div className="rules-container-outer">
          <div className="rules-container-inner">
            <h2> Game rules - How to play</h2>
            <h3>1. Setup:</h3>
            <p>
              Participants, who can be educators, students, or administrative
              staff, collaborate to design an assessment method. Initially, they
              select three mission cards that define their goals. Additionally,
              players may optionally set a maximum number of turns for the game.
            </p>
            <h3>2. Gameplay:</h3>
            <p>
              Table Layout: At the start, the three mission cards are placed
              alongside six random assessment cards, each from a different
              assessment category. Drawing and Actions: Players take turns
              drawing a card from any of the six category decks. After drawing a
              card, the player has four options:
            </p>
            <ul className="rules-list">
              <li>
                Replace: Substitute an assessment card on the table (from the
                same category) with the drawn card.{" "}
              </li>
              <li>Remove: Eliminate the drawn card from the game. </li>
              <li>
                Pass: Return the drawn card to the bottom of its respective deck
                and end the turn.{" "}
              </li>
              <li>
                Vote: Call for a vote among players to determine if the current
                set of assessment cards meets the group’s goals. If the majority
                votes in favor, the game can end prematurely. You cannot call a vote after you draw a card.
              </li>
            </ul>
            <button
              className="play-btn"
              type="button"
              onClick={() => navigate("/game-setup")}
            >
              PLAY NOW
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainGame;
