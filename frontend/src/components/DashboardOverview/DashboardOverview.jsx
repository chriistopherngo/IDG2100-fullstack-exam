import React, { useState } from "react";
import "./DashboardOverview.css";
import OverviewCell from "./OverviewCell";

// Axios fetching method: https://www.mongodb.com/developer/code-examples/javascript/react-query-rest-api-realm/

// Find the total amount of mission cards
export const useMissionCount = () => {
  const [missionCount, setMissionCount] = useState(0);
  const handleMissionCount = (count) => {
    setMissionCount(count);
  };
  return { missionCount, setMissionCount, handleMissionCount };
}

// Find the total amount of assessment cards
export const useAssessmentCount = () => {
  const [assessmentCount, setAssessmentCount] = useState(0);
  const handleAssessmentCount = (count) => {
    setAssessmentCount(count);
  };
  return { assessmentCount, setAssessmentCount, handleAssessmentCount };
}

// Find the total amount of cards
export const useTotalCardCount = (missionCount, assessmentCount) => {
  return assessmentCount + missionCount;
}


const DashboardOverview = () => {
  const { missionCount, handleMissionCount } = useMissionCount();
  const { assessmentCount, handleAssessmentCount } = useAssessmentCount();
  const TotalCardCount = useTotalCardCount(missionCount, assessmentCount);

  return (
    <>
      <div className="overview__container">
        <div className="overviewCell">
          <span>Total Count:</span> {TotalCardCount}
        </div>

        <OverviewCell
          name="Mission Cards"
          url="api/mission"
          onCount={handleMissionCount}
        />
        <OverviewCell
          name="Assessment Cards"
          url="api/assessment"
          onCount={handleAssessmentCount}
        />

        <OverviewCell name="Total users" url="api/user" />

        <OverviewCell
          name="Who is assessed"
          url="api/search?card-type=assessment&card-category=who%20is%20assessed&all"
        />

        <OverviewCell
          name="The assessor"
          url="api/search?card-type=assessment&card-category=the%20assessor&all"
        />

        <OverviewCell
          name="Artefact"
          url="api/search?card-type=assessment&card-category=assessment%20artefact&all"
        />

        <OverviewCell
          name="Context"
          url="api/search?card-type=assessment&card-category=context&all"
        />

        <OverviewCell
          name="Format"
          url="api/search?card-type=assessment&card-category=assessment%20format&all"
        />

        <OverviewCell
          name="Timing"
          url="api/search?card-type=assessment&card-category=assessment%20timing&all"
        />
      </div>
    </>
  );
};

export default DashboardOverview;
