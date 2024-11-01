import React, { useState, useEffect } from "react";
import fetchData from "../../utils/fetchSchemeData";
import Scheme from "../SchemeManagement/Scheme";

const LandingScheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [schemeCount, setSchemeCount] = useState(0);
  const [assessmentCards, setAssessmentCards] = useState([]);
  const [missionCards, setMissionCards] = useState([]);

  // Fetch public schemes, assessment cards and mission cards
  useEffect(() => {
    fetchData("api/scheme/public", setSchemes, setSchemeCount);
    fetchData("api/assessment", setAssessmentCards);
    fetchData("api/mission", setMissionCards);
  }, []);

  return (
    <div className="landing_scheme">
      {schemeCount === 0 && (
        <div className="no_schemes">No schemes found in the Database.</div>
      )}
      {/* Showcase the three highests rated schemes */}
      {schemeCount !== 0 &&
        schemes.slice(0, 3).map((scheme, index) => (
          <Scheme
            key={scheme._id}
            scheme={scheme}
            index={index}
            assessmentCards={assessmentCards}
            missionCards={missionCards}
          />
        ))}
    </div>
  );
};

export default LandingScheme;
