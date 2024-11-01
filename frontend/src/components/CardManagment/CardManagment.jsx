import React, { useEffect, useState } from "react";
import instance from "../../utils/axios";
import CardEditForm from "../CardEditForm/CardEditForm";
import "./CardManagment.css";
import { useAuth } from "../../context/AuthContext";
import NewCard from "../NewCard/NewCard";
import { MdCheck } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import BulkUploadForm from "../BulkUploadForm/BulkUploadForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GeneratePdf from "../../utils/GeneratePdf";
import Loading from "../../utils/Loading";
import EditIconByCategory from "../EditIconByCategory/BulkEditIcons";
import getConfig from "../../utils/getConfig";
import EditDefaultIcon from "../EditDefaultIcon/EditDefaultIcon";

const CardManagement = ({ cardType }) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [filterByCategory, setFilterByCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAllItems, setSelectAllItems] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [filterMode, setFilterMode] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [openEditIconByCategory, setOpenEditIconByCategory] = useState("");
  const [generaingPdf, setGeneratingPdf] = useState(false);
  const [open, setOpen] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  const [openEditDefaultIcon, setOpenEditDefaultIcon] = useState(false);

  const { token } = useAuth();

  // define API endpoint based on cardType from parent
  const apiEndpoint =
    cardType === "mission"
      ? "http://localhost:5353/api/mission"
      : "http://localhost:5353/api/assessment";

  //  Populate the cards state with data from the API
  useEffect(() => {
    instance
      .get(apiEndpoint, getConfig(token))
      .then((res) => {
        setCards(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [apiEndpoint]);

  const handleDeleteCard = () => {
    if (selectedCard) {
      instance
        .delete(
          `http://localhost:5353/api/${cardType}/${selectedCard.card_id}`,
          getConfig(token)
        )
        .then(() => {
          setCards(
            // if the card_id does not match the selected card, keep it in the array
            cards.filter((card) => card.card_id !== selectedCard.card_id)
          );
          setSelectedCard(null);
        })
        .catch((error) => {
          console.error(
            `There was an error deleting the ${cardType} card:`,
            error
          );
        });
    }
  };

  const handleButtonSelect = (card) => {
    setFilterMode(true);
    // find the index of the selected card
    const index = selectedItems.findIndex(
      (selectedCard) => selectedCard._id === card._id
    );
    // if the card is not in the selectedItems array, add it
    if (index === -1) {
      setSelectedItems([...selectedItems, card]);
    } else {
      // if the card is in the selectedItems array, remove it
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(index, 1);
      setSelectedItems(updatedSelectedItems);
    }
  };

  const handleSelectAll = () => {
    setSelectAllItems(!selectAllItems);
    setFilterMode(true);
    // If selectAllItems is true, set all cards to whatever is in searchedCards
    if (!selectAllItems) {
      setSelectedItems([...searchedCards]);
    } else {
      setSelectedItems([]);
    }
  };

  const onSelectMode = () => {
    // If there are selected items, do not allow to turn off select mode
    if (selectedItems.length > 0) {
    } else {
      setSelectMode(!selectMode);
    }
  };

  const onFilterMode = () => {
    setFilterMode(!filterMode);
    if (filterMode) {
      // If you set turn off filter mode, set all filter back to display All
      handleFilterByCategory("All");
      // If you set turn off filter mode, reset all search to display all cards
      setSearchQuery("");
    }
  };

  // Reset all filters
  const onResetAll = () => {
    handleFilterByCategory("All");
    setSearchQuery("");
    setSelectedItems([]);
    setSelectAllItems("");
  };

  const handleAddCard = (newCard) => {
    if (Array.isArray(newCard)) {
      // Check if the response is an array
      setCards((prevCards) => [...prevCards, ...newCard]); // Spread the array into existing cards
    } else {
      setCards((prevCards) => [...prevCards, newCard]); // Handle a single card
    }
  };

  // Close the card
  const handleCloseCard = () => {
    setSelectedCard(null);
  };

  // Toggle the open state of the NewCard component
  const handleSetOpen = () => {
    setOpen(!open);
  };

  //  Replace the existing card with the updated card in the cards state
  const handleUpdate = (updatedCard) => {
    const updatedCards = cards.map((card) =>
      card.card_id === updatedCard.card_id ? updatedCard : card
    );
    setCards(updatedCards);
    setSelectedCard(null);
  };

  // Filter the cards by category
  const handleFilterByCategory = (category) => {
    setFilterByCategory(category);
  };

  let filteredCards;
  if (filterByCategory === "All") {
    // Display all cards
    filteredCards = cards;
  } else if (filterByCategory === "ONLYSELECTED") {
    // Filter the cards by selected items
    filteredCards = selectedItems;
  } else {
    // Filter the cards by category
    filteredCards = cards.filter(
      (card) => card.card_category === filterByCategory
    );
  }

  // Search the cards by name or category
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter the cards by search query
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

  // Handle card click
  const handleCardClick = (card) => {
    // If select mode is on, select the card
    if (selectMode) {
      handleButtonSelect(card);
    } else {
      // If select mode is off, open the card for editing
      setSelectedCard(card);
    }
  };

  // toggle the open state of the bulk upload form
  const handleSetOpenBulk = () => {
    setOpenBulk(!openBulk);
  };

  // Toggle the open state of the EditIconByCategory component
  const handleSetOpenEditIconByCategory = () => {
    setOpenEditIconByCategory(!openEditIconByCategory);
  };
  // Toggle the open state of the EditDefaultIcon component
  const handleSetOpenEditDefaultIcon = () => {
    setOpenEditDefaultIcon(!openEditDefaultIcon);
  };

  // general notification function for success toasts
  const notify = (message) =>
    toast.success(message, {
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

  // Loading spinner
  if (isLoading) {
    return <Loading />;
  }

  // Show a loading spinner-toast while generating the PDF
  if (generaingPdf) {
    // add toastId to prevent over-ride the general toast (notify)
    toast.loading("Generating PDF...", { toastId: "generatingPdf" });
  } else {
    toast.dismiss("generatingPdf");
  }

  return (
    <>
      {openBulk && (
        <BulkUploadForm
          handleSetOpenBulk={handleSetOpenBulk}
          handleAddCard={handleAddCard}
        />
      )}

      {openEditIconByCategory && (
        <EditIconByCategory
          selectedItems={selectedItems}
          onClose={handleSetOpenEditIconByCategory}
          onNotify={notify}
        />
      )}

      {open && (
        <NewCard
          onAddCard={handleAddCard}
          onClose={handleSetOpen}
          getCardType={cardType}
          onNotify={notify}
          cards={cards}
        />
      )}

      {openEditDefaultIcon && (
        <EditDefaultIcon cards={cards} onClose={handleSetOpenEditDefaultIcon} onNotify={notify} getCardType={cardType} />
      )}
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
                <>
                  <div>
                    <button onClick={() => handleSetOpenEditIconByCategory()}>
                      Edit icon
                    </button>
                  </div>
                  <div className="generate-pdf-container">
                    <button
                      className="generate-pdf"
                      onClick={() => {
                        GeneratePdf(selectedItems, setGeneratingPdf);
                      }}
                    >
                      Generate PDF
                    </button>
                  </div>
                  <div className="reset-all-container">
                    <div
                      className="reset-all"
                      onClick={() => {
                        onResetAll();
                      }}
                    >
                      <div className="reset-filters">
                        <MdCancel /> <span>Reset all filters</span>{" "}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="manage_cards_container">
          <div className="add-new-card-container" onClick={handleSetOpen}>
            <div className="add-new-card">
              <div>+</div>
              <span>Add new card</span>
            </div>
          </div>
          <div
            className="add-new-card-container"
            onClick={handleSetOpenEditDefaultIcon}
          >
            <div className="add-new-card">
              <div className="document-bulk">
                <img src="/public/img/edit-svgrepo-com.svg" alt="" />
              </div>
              <span>Edit default icon</span>
            </div>
          </div>
          <div className="add-new-card-container" onClick={handleSetOpenBulk}>
            <div className="add-new-card">
              <div className="document-bulk">
                <img src="/public/img/document-bulk.svg" alt="" />
              </div>
              <span>Bulk upload</span>
            </div>
          </div>
          

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
                  card-icon={`http://localhost:5353/${card.card_icon} `}
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

      {selectedCard && (
        <CardEditForm
          selectedCard={selectedCard}
          onClose={handleCloseCard}
          onUpdateCard={handleUpdate}
          onDeleteCard={handleDeleteCard}
          onNotify={notify}
        />
      )}
      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
};

export default CardManagement;
