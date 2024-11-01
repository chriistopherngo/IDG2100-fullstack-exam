import React, { useState } from "react";
import { useGame } from "./GameContext";
import instance from "../../utils/axios";
// import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBeforeUnload } from "../../utils/BeforeUnload";
import { useAuth } from "../../context/AuthContext";
import getConfig from "../../utils/getConfig";

import Scheme from "../SchemeManagement/Scheme";

const PostGame = () => {
  const { assessmantTableCards, selectedMissionCards, players, wonGame } =
    useGame();
  const [email, setEmail] = useState("");
  const [errorMSg, setError] = useState("");
  const [usersSentTo, setUsersSentTo] = useState([]);

  const baseURL = "http://localhost:5353";
  const { token } = useAuth();

  // Show a warning before leaving the page
  useBeforeUnload();

  let assessmentArray = [];
  let missionArray = [];
  // push the id of the selected cards to an array
  assessmantTableCards.forEach((card) => assessmentArray.push(card._id));
  selectedMissionCards.forEach((card) => missionArray.push(card._id));

  // Make sequential API calls to authorize scheme creation
  // Source: https://stackoverflow.com/a/59562060
  const sendScheme = async () => {
    try {
      // Return an error if the provided email is empty
      if (email === "") {
        toast.error("Email cannot be empty");
        return;
      }

      // Return an error if the email has already been sent a scheme
      if (usersSentTo.includes(email)) {
        toast.error("Already sent scheme to this user");
        return;
      }

      // Only allow sending schemes up to the number of players in the game
      if (usersSentTo.length >= players.length) {
        toast.error("Can't send scheme to more users");
        return;
      }

      // Find the relevant user's MongoDB ObjectId
      const res1 = await instance.get(
        `api/user/teachers/${email}`,
        getConfig(token)
      );

      // Return an error toast if the teacher is not found
      if (res1.data.length == 0) {
        toast.error("No teacher with that email found");
        return;
      }

      // Save the teacher's ObjectId to a variable
      const teacherId = res1.data[0]._id;

      // Add the ObjectId and scheme cards to form data
      const formData = {
        mission_cards: missionArray,
        assessment_cards: assessmentArray,
        creator: teacherId,
      };

      // Post the scheme to the API
      const response = await instance.post(
        "api/scheme",
        formData,
        getConfig(token)
      );

      // Update state and show success message
      setUsersSentTo((prevUsersSentTo) => [...prevUsersSentTo, email]);
      setEmail("");
      setError("");
      toast.success("Scheme sent successfully!");
    } catch (error) {
      toast.error("Invalid email");
      setError("Invalid email");
    }
  };
  return (
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar
        theme="colored"
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        position="bottom-right"
      />

      <div className="header-post-game">
        {!wonGame && <h1>Game Over!</h1>}
        {wonGame && <h1>Congratulations!</h1>}
        <h2>Please input an account email the scheme should be sent to</h2>
        <p>
          You can only send the scheme to a teacher account. The scheme will be
          stored in the teacher's account. You can only send as many schemes as
          there are players in the game.
        </p>

        <form className="post-game-form">
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </form>
        {errorMSg && <p className="error">{errorMSg}</p>}
        <button onClick={sendScheme}>Send Scheme</button>
      </div>

      <div className="schemes_display">
        <div className="post-game-card-container">
          {selectedMissionCards.map((missionCard, i) => (
            <game-super-mission-card
              key={i}
              card-id={missionCard.card_id}
              card-type={missionCard.card_type}
              card-name={missionCard.card_name}
              card-description={missionCard.card_description}
              card-icon={`${baseURL}/${missionCard.card_icon}`}
            />
          ))}
        </div>

        <div className="post-game-card-container">
          {assessmantTableCards.map((assessmentCard, i) => (
            <game-super-assessment-card
              key={i}
              card-id={assessmentCard.card_id}
              card-category={assessmentCard.card_category}
              card-name={assessmentCard.card_name}
              card-description={assessmentCard.card_description}
              card-details={assessmentCard.card_details}
              card-icon={`${baseURL}/${assessmentCard.card_icon}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PostGame;
