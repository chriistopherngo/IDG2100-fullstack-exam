import { useGame } from "./GameContext";
import { TbReplace } from "react-icons/tb";
import { IoIosRemoveCircle } from "react-icons/io";
import { BiSkipNextCircle } from "react-icons/bi";
import { PiLightning } from "react-icons/pi";

const Actions = ({ onCallAction, onCallVote, cardInHand }) => {
  const { players } = useGame();

  return (
    <div className="actions">
      <p>
        {" "}
        <PiLightning /> Actions
      </p>
      <div className="action" onClick={() => onCallAction("replace")}>
        <TbReplace /> Replace card
      </div>
      <div className="action" onClick={() => onCallAction("remove")}>
        <IoIosRemoveCircle /> Remove card from game
      </div>
      <div className="action" onClick={() => onCallAction("pass")}>
        <BiSkipNextCircle /> Pass
      </div>
      {players.length > 1 ? (
        <div
          className={`callVote ${!cardInHand ? "action" : "noVote"}`}
          onClick={onCallVote}
        >
          Call vote!
        </div>
      ) : (
        <div
          className={`callVote ${!cardInHand ? "action" : "noVote"}`}
          onClick={onCallVote}
        >
          Missions complete!
        </div>
      )}
    </div>
  );
};

export default Actions;
