import React, { useEffect, useState } from "react";
import instance from "../../utils/axios";
import "./CardDisplay.css";
import { MdCheck } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import GeneratePdf from "../../utils/GeneratePdf";
import Loading from "../../utils/Loading";
import { ToastContainer, toast } from "react-toastify";

const CardDisplay = ({ cardType }) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [filterByCategory, setFilterByCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAllItems, setSelectAllItems] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [filterMode, setFilterMode] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleButtonSelect = (card) => {
    setFilterMode(true); // if filter mode is off, this will set filter mode to true when selecting card, UX reasons
    const index = selectedItems.findIndex(
      (selectedCard) => selectedCard._id === card._id
    );
    if (index === -1) {
      setSelectedItems([...selectedItems, card]);
    } else {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(index, 1);
      setSelectedItems(updatedSelectedItems);
    }
  };

  const handleSelectAll = () => {
    setSelectAllItems(!selectAllItems);
    setFilterMode(true); // if filter mode is off, this will set filter mode to true when selecting all cards, UX reasons
    if (!selectAllItems) {
      setSelectedItems([...searchedCards]);
    } else {
      setSelectedItems([]);
    }
  };

  const onSelectMode = () => {
    if (selectedItems.length == 0) {
      setSelectMode(!selectMode);
    }
  };

  const onFilterMode = () => {
    setFilterMode(!filterMode);
    if (filterMode) {
      handleFilterByCategory("All"); // If you set turn off filter mode, set all filter back to display All
      setSearchQuery(""); // If you set turn off filter mode, reset all search to display all cards
    }
  };

  const onResetAll = () => {
    handleFilterByCategory("All");
    setSearchQuery("");
    setSelectedItems([]);
    setSelectAllItems("");
  };

  // define API endpoint based on cardType from parent
  const apiEndpoint =
    cardType === "mission"
      ? "http://localhost:5353/api/mission"
      : "http://localhost:5353/api/assessment";

  //  Populate the cards state with data from the API
  useEffect(() => {
    instance
      .get(apiEndpoint)
      .then((res) => {
        setCards(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [apiEndpoint]);

  const handleFilterByCategory = (category) => {
    setFilterByCategory(category);
  };

  const filteredCards =
    filterByCategory === "All"
      ? cards
      : filterByCategory === "ONLYSELECTED"
        ? selectedItems
        : cards.filter((card) => card.card_category === filterByCategory);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const searchedCards = filteredCards.filter((card) => {
    if (cardType === "mission") {
      const cardName = card.card_name.toLowerCase();
      return cardName.includes(searchQuery);
    } else if (cardType === "assessment") {
      const category = card.card_category.toLowerCase();
      const cardName = card.card_name.toLowerCase();
      return category.includes(searchQuery) || cardName.includes(searchQuery);
    }
  });

  const handleCardClick = (card) => {
    if (selectMode) {
      handleButtonSelect(card);
    } else {
      setSelectedCard(card);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (generatingPdf) {
    toast.loading("Generating PDF...")
  } else {
    toast.dismiss();
  }

  return (
    <>
      <div className="manage_cards_container_outer">
        <div className="selection-mode-btn filter">
          {cardType === "assessment" && (
            <button
              className={filterMode ? "active" : ""}
              onClick={() => onFilterMode()}
            >
              Filter
            </button>
          )}

          {filterMode && (
            <div className="filter_users_container">
              <div className="filter-buttons position">
                {cardType === "assessment" && (
                  <>
                    <button
                      className={filterByCategory === "All" ? "activepos" : ""}
                      onClick={() => handleFilterByCategory("All")}
                    >
                      All
                    </button>
                    <button
                      className={
                        filterByCategory === "the assessor" ? "activepos" : ""
                      }
                      onClick={() => handleFilterByCategory("the assessor")}
                    >
                      The Assessor
                    </button>
                    <button
                      className={
                        filterByCategory === "who is assessed"
                          ? "activepos"
                          : ""
                      }
                      onClick={() => handleFilterByCategory("who is assessed")}
                    >
                      Who is Assessed
                    </button>
                    <button
                      className={
                        filterByCategory === "context" ? "activepos" : ""
                      }
                      onClick={() => handleFilterByCategory("context")}
                    >
                      Context
                    </button>
                    <button
                      className={
                        filterByCategory === "assessment artefact"
                          ? "activepos"
                          : ""
                      }
                      onClick={() =>
                        handleFilterByCategory("assessment artefact")
                      }
                    >
                      Artefact
                    </button>
                    <button
                      className={
                        filterByCategory === "assessment timing"
                          ? "activepos"
                          : ""
                      }
                      onClick={() =>
                        handleFilterByCategory("assessment timing")
                      }
                    >
                      Timing
                    </button>
                    <button
                      className={
                        filterByCategory === "assessment format"
                          ? "activepos"
                          : ""
                      }
                      onClick={() =>
                        handleFilterByCategory("assessment format")
                      }
                    >
                      Format
                    </button>

                    <button
                      className={
                        filterByCategory === "ONLYSELECTED" ? "activepos" : ""
                      }
                      onClick={() => handleFilterByCategory("ONLYSELECTED")}
                    >
                      Only Selected ({selectedItems.length})
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        {cardType == "assessment" && (
          <input
            className="search_input"
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={handleSearch}
          />
        )}

        {cardType == "mission" && (
          <>
            <input
              className="search_input"
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </>
        )}

        <div className="selection-mode-btn withReset">
          <button
            className={selectMode ? "active" : ""}
            onClick={() => onSelectMode()}
          >
            Selection mode: {selectMode ? "ON" : "OFF"}
          </button>

          {selectMode && (
            <>
              <button
                className="select-all-btn"
                type="button"
                onClick={handleSelectAll}
              >
                {selectAllItems ? "Deselect All" : "Select All"}
              </button>


              {selectedItems.length > 0 && (
        <div className="generate-pdf-container">
          <button
            onClick={() => {
              GeneratePdf(selectedItems, setGeneratingPdf);
            }}
          >
            Generate PDF
          </button>
        </div>
      )}
              {selectedItems.length > 0 && (
                <>
                  <div className="reset-all-container">
                    <div
                      className="reset-all"
                      onClick={() => {
                        onResetAll();
                      }}
                    >
                      <div className="reset-filters">
                        <MdCancel />{" "}
                        <span >
                          Reset all filters
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="manage_cards_container">
          {searchedCards.map((card) => (
            <div
              key={card._id}
              className={`manage_cards_card ${
                selectedItems.some(
                  (selectedCard) => selectedCard._id === card._id
                )
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card_hero card_data">
                {selectMode && (
                  <div
                    className={`selection-mode ${
                      selectedItems.some(
                        (selectedCard) => selectedCard._id === card._id
                      )
                        ? "selected"
                        : ""
                    }`}
                  >
                    <div className="selection-noncheck">
                      {" "}
                      <div
                        className={`selection-check ${
                          selectedItems.some(
                            (selectedCard) => selectedCard._id === card._id
                          )
                            ? "selected"
                            : ""
                        }`}
                      >
                        <MdCheck />
                      </div>{" "}
                    </div>
                  </div>
                )}
              </div>

              {cardType === "assessment" && (
                <super-assessment-card
                  id={card._id}
                  card-id={card.card_id}
                  card-name={card.card_name}
                  card-category={card.card_category}
                  card-description={card.card_description}
                  card-details={card.card_details}
                  card-icon={`http://localhost:5353/${card.card_icon}`}
                  onClick={() => handleCardClick(card)}
                />
              )}

              {cardType === "mission" && (
                <super-mission-card
                  id={card._id}
                  card-id={card.card_id}
                  card-type={card.card_type}
                  card-name={card.card_name}
                  card-description={card.card_description}
                  card-icon={`http://localhost:5353/${card.card_icon}`}
                  onClick={() => handleCardClick(card)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
};

export default CardDisplay;
