import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import fetchData from "../../utils/fetchSchemeData";
import Scheme from "../SchemeManagement/Scheme";
import EditScheme from "./EditScheme";
import getConfig from "../../utils/getConfig";
import { jwtDecode } from "jwt-decode";
import instance from "../../utils/axios";

const UserSchemes = () => {
  const { token } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [schemeCount, setSchemeCount] = useState(0);
  const [assessmentCards, setAssessmentCards] = useState([]);
  const [missionCards, setMissionCards] = useState([]);
  const [toggleEditScheme, setToggleEditScheme] = useState(false);
  const [publicSchemes, setPublicSchemes] = useState([]);
  const [user, setUser] = useState(null);
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState([]);

  // fetch user schemes
  useEffect(() => {
    // get scheme data
    fetchData("api/scheme", setSchemes, setSchemeCount, getConfig(token));
    fetchData("api/assessment", setAssessmentCards);
    fetchData("api/mission", setMissionCards);
    fetchData("api/scheme/public", setPublicSchemes, getConfig(token));

    // get user data
    const decoded = jwtDecode(token);
    instance
      .get(`api/user/${decoded._id}`, getConfig(token))
      .then((res) => {
        setUser(res.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  // Get all schemes that are in the user's bookmarks
  useEffect(() => {
    if (user && publicSchemes.length) {
      const bookmarked = user.bookmarks;
      const bookmarkedSchemes = publicSchemes.filter((scheme) =>
        bookmarked.includes(scheme._id)
      );
      setBookmarkedSchemes(bookmarkedSchemes);
    }
  }, [user, publicSchemes]);

  const handleEditScheme = () => {
    setToggleEditScheme(!toggleEditScheme);
  };

  return (
    <>
      <div className="landing_scheme">
        {schemeCount === 0 && (
          <div className="no_schemes">No schemes found.</div>
        )}
        {schemeCount !== 0 &&
          schemes.map((scheme) => (
            <>
              <div>
                <div className="edit_scheme_btn_container">
                  <button className="scheme_btns ediit" onClick={handleEditScheme}>
                    Edit Scheme
                  </button>
                </div>

                <Scheme
                  key={scheme._id}
                  scheme={scheme}
                  index={scheme._id}
                  assessmentCards={assessmentCards}
                  missionCards={missionCards}
                />
              </div>
              {toggleEditScheme && (
                <EditScheme
                  schemeAssessmentCards={assessmentCards}
                  schemeMissionCards={missionCards}
                  scheme={scheme}
                  setSchemes={setSchemes}
                  onEditScheme={handleEditScheme}
                />
              )}
            </>
          ))}
      </div>
      <h2 className="bookied_schemes">Bookmarked Schemes </h2>
      <div className="landing_scheme profilepage">
        {bookmarkedSchemes.length === 0 && (
          <div className="no_schemes">No bookmarked schemes found.</div>
        )}
        {bookmarkedSchemes.length !== 0 &&
          bookmarkedSchemes.map((scheme) => (
            <Scheme
              key={scheme._id}
              scheme={scheme}
              index={scheme._id}
              assessmentCards={assessmentCards}
              missionCards={missionCards}
            />
          ))}
      </div>
    </>
  );
};

export default UserSchemes;
