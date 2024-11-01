import React, { useState, useEffect } from "react";
import {
  useMissionCount,
  useAssessmentCount,
  useTotalCardCount,
} from "../components/DashboardOverview/DashboardOverview";
import OverviewCell from "../components/DashboardOverview/OverviewCell";
import LandingScheme from "../components/LandingPage/LandingScheme";

const Home = () => {
  const { missionCount, handleMissionCount } = useMissionCount();
  const { assessmentCount, handleAssessmentCount } = useAssessmentCount();
  const TotalCardCount = useTotalCardCount(missionCount, assessmentCount);

  const [overviewCellClassName, setOverviewCellClassName] =
    useState("overviewCell");

  useEffect(() => {
    setOverviewCellClassName("landingpage");
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="landing_page_text_outer">
          <div className="landing_page_text">
            <div className="title">
              <div className="title_containing_h1_button">
                <h1>The SUPER Assessor</h1>
                <div className="description">
                  <p>
                    Welcome to the SUPER Assessor Interface! Our platform offers
                    The Super Assessor card game and essential tools for
                    efficient collection management.
                  </p>
                  <p>
                    The SUPER Assessor card game is designed to aid educators in
                    crafting innovative assessment methods. Our interface boasts
                    several key features:
                  </p>
                  <ul>
                    <li>
                      Play the SUPER Assessor game with colleagues, saving your
                      assessment schemes for future review and editing.
                    </li>
                    <li>
                      Share your schemes with other educators for feedback and
                      rating.
                    </li>
                    <li>
                      Administrators can manage cards, update content, and
                      oversee user accounts through the dashboard.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="image">
              <div className="test">
                <img src="/public/img/landing_page_cards.png" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="overview__container landingpage">
          <div className="overviewCell landingpage">
            <span>Total Count:</span> {TotalCardCount}
          </div>

          <OverviewCell
            name="Mission Cards"
            url="api/mission"
            onCount={handleMissionCount}
            className={overviewCellClassName}
          />

          <OverviewCell
            name="Assessment Cards"
            url="api/assessment"
            onCount={handleAssessmentCount}
            className={overviewCellClassName}
          />

          <OverviewCell
            name="Registered Teachers"
            url="api/user/teachers"
            className={overviewCellClassName}
          />
        </div>
        <div className="top_schemes">
          <h2>Top Rated Schemes:</h2>
          <LandingScheme />
        </div>
      </div>
    </>
  );
};

export default Home;
