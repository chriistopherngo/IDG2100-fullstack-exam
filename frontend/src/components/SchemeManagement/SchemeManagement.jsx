import React, { useState, useEffect } from "react";
import Scheme from "./Scheme";
import fetchData from "../../utils/fetchSchemeData";
import instance from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getConfig from "../../utils/getConfig";

const RateScheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [schemeCount, setSchemeCount] = useState(0);
  const [assessmentCards, setAssessmentCards] = useState([]);
  const [missionCards, setMissionCards] = useState([]);
  const [ratings, setRatings] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState({});

  const { token } = useAuth();

  // fet the user data
  useEffect(() => {
    const decoded = jwtDecode(token);
    instance
      .get(`api/user/${decoded._id}`, getConfig(token))
      .then((res) => {
        setUser(res.data[0]);
        setInitialBookmarks(res.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [token]);

  // Fetch public schemes, assessment cards and mission cards
  useEffect(() => {
    fetchData("api/scheme/public", setSchemes, setSchemeCount);
    fetchData("api/assessment", setAssessmentCards);
    fetchData("api/mission", setMissionCards);

    setStatusMessage("");
  }, [statusMessage]);

  // Set the initial bookmarks state
  const setInitialBookmarks = (user) => {
    if (user.bookmarks.length > 0) {
      user.bookmarks.forEach((bookmark) => handleBookmarkState(bookmark, true));
    }
  };

  // Add a new rating to the ratings state, using the scheme's ObjectId as a key
  const addSchemeRating = (schemeId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [schemeId]: rating,
    }));
  };

  const handleRateScheme = async (schemeId, rating) => {
    if (user.position !== "Teacher") {
      toast.error(
        "You need to be a teacher to rate a scheme. Contact the system administrator for more information."
      );
      return;
    }

    const payload = {
      rating: rating,
    };

    if (payload.rating == undefined) {
      toast.error("Please enter a rating between 1 and 5.");
      return;
    }

    if (payload.rating < 1 || payload.rating > 5) {
      toast.error("Please enter a rating between 1 and 5.");
      return;
    }
    // Perform a put request to update the scheme rating
    instance
      .put(`api/scheme/rate/${schemeId}`, payload, getConfig(token))
      .then((res) => {
        // Update statusMessage state to rerender component
        setStatusMessage(res.data);
        // Show success message to the user
        toast.success("Successfully rated scheme!");
      })
      .catch((error) => {
        // Show error message to the user
        toast.error(
          "An error occurred while rating the scheme. Please try again."
        );
        // Print error response to console
        console.error(error.response);
      });
  };

  const handleBookmarkScheme = async (schemeId) => {
    const payload = {
      bookmark: schemeId,
    };
    const response = await instance.put(
      `api/user/bookmark/${user._id}`,
      payload,
      getConfig(token)
    );

    if (response.data === "Added bookmark") {
      handleBookmarkState(schemeId, true);
      toast.success("Scheme added to bookmarks");
    } else if (response.data === "Removed bookmark") {
      handleBookmarkState(schemeId, false);
      toast.info("Scheme removed from bookmarks");
    }
  };

  const handleBookmarkState = (schemeId, bookmarkStatus) => {
    setBookmarks((prevBookmarks) => ({
      ...prevBookmarks,
      [schemeId]: bookmarkStatus,
    }));
  };

  return (
    <>
      <div className="schemes">
        {schemeCount === 0 && (
          <div className="no_schemes">No schemes found in the Database.</div>
        )}
        {schemeCount !== 0 &&
          schemes.map((scheme, index) => (
            <div className="scheme_wapper" key={scheme._id}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className={`bookmark_scheme ${bookmarks[scheme._id] ? "bookmarked" : ""}`}
                  onClick={() => handleBookmarkScheme(scheme._id)}
                >
                  {!bookmarks[scheme._id] && "Bookmark Scheme"}
                  {bookmarks[scheme._id] && (
                    <span>
                      Bookmarked Scheme{" "}
                      <span role="img" aria-label="checkmark">
                        &#9989;
                      </span>
                    </span>
                  )}
                </button>
              </div>

              <br />

              <div className="rating_wrapper">
                <input
                  id={`rating_${scheme._id}`}
                  type="number"
                  placeholder="Give rating (1-5)"
                  max={5}
                  min={1}
                  value={ratings[scheme._id] || ""}
                  onChange={(e) => addSchemeRating(scheme._id, e.target.value)}
                />
                <button
                  className="update_scheme"
                  onClick={() =>
                    handleRateScheme(scheme._id, ratings[scheme._id])
                  }
                >
                  Rate Scheme
                </button>
              </div>

              <Scheme
                scheme={scheme}
                index={index}
                assessmentCards={assessmentCards}
                missionCards={missionCards}
              />
            </div>
          ))}
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
};

export default RateScheme;
