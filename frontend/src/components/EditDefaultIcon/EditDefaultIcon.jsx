import React, { useState } from "react";
import "./EditDefaultIcon.css";
import { IoMdClose } from "react-icons/io";
import instance from "../../utils/axios";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const EditDefaultIcon = ({ cards, onClose, onNotify, getCardType }) => {
  const [oldImageUrl, setOldImageUrl] = useState(
    `${getCardType === "mission" ? "http://localhost:5353/uploads/icon-mission.png" : ""}`
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [shortenedCategoryName, setShortenedCategoryName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Extract unique categories from cards
  let categories = [];
  cards.forEach((card) => {
    if (!categories.includes(card.card_category)) {
      categories.push(card.card_category);
    }
  });
  // Handle category change to update image URL
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);

    // Update the image URL based on the selected category
    switch (selectedCategory) {
      case "assessment timing":
        setOldImageUrl(`http://localhost:5353/uploads/icon-timing.png`);
        setShortenedCategoryName("timing");
        break;
      case "assessment format":
        setOldImageUrl(`http://localhost:5353/uploads/icon-format.png`);
        setShortenedCategoryName("format");
        break;
      case "assessment artefact":
        setOldImageUrl(`http://localhost:5353/uploads/icon-artefact.png`);
        setShortenedCategoryName("artefact");
        break;
      case "context":
        setOldImageUrl(`http://localhost:5353/uploads/icon-context.png`);
        setShortenedCategoryName("context");
        break;
      case "the assessor":
        setOldImageUrl(`http://localhost:5353/uploads/icon-assessor.png`);
        setShortenedCategoryName("assessor");
        break;
      case "who is assessed":
        setOldImageUrl(`http://localhost:5353/uploads/icon-assessed.png`);
        setShortenedCategoryName("assessed");
        break;
      default:
        setOldImageUrl("");
        break;
    }
  };

  // Handle icon change to update image URL
  const handleIconChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setNewImageUrl(newImageUrl);
      setFile(file);
    }
  };

  // function to close the delete confirmation modal
  const handleConfirmationAction = () => {
    if (!oldImageUrl) {
      toast.error("Please select a category.");
    } else if (!newImageUrl) {
      toast.error("Please select a new icon.");
    } else {
      setShowConfirmation(!showConfirmation);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("default_icon", file);

    await instance
      .post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          category:
            getCardType === "assessment" ? shortenedCategoryName : "mission",
        },
      })
      .then((res) => {
        onNotify(`Updated the default icon for "${selectedCategory}"!`);
        onClose();
        setNewImageUrl("");
        setFile(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("An error occurred while updating the icon.");
      });
  };

  return (
    <div className="modal">
      <div className="editDefaultIconContainer">
        <div className="close_card versionTwo editDefaultIcon">
          <div className="iconPlusText" onClick={() => onClose()}>
            <IoMdClose size={30} /> <span>Close</span>
          </div>
        </div>
        <div className="editDefaultIcon">
          <div className="default-icons-link">
            <a href="/public/default-icons.zip" download={"default-icons.zip"}>
              Download Default Icons
            </a>
          </div>

          <form onSubmit={handleSubmit}>
            <h2>Change default icon</h2>
            <div className="field">
              {getCardType === "assessment" ? (
                <>
                  <label htmlFor="category">Select category</label>
                  <select
                    name="category"
                    id="category"
                    onChange={handleCategoryChange}
                  >
                    <option>category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <div>Mission cards</div>
              )}
            </div>

            <div className="field">
              <label htmlFor="icon">Select new icon</label>
              <input
                type="file"
                name="default_icon"
                id=""
                onChange={handleIconChange}
              />
            </div>

            <div className="image-preview">
              <div className="items_container">
                <div className="items">
                  {oldImageUrl ? (
                    <>
                      <span>Old icon</span>
                      <img src={oldImageUrl} alt="Selected Category Icon" />
                    </>
                  ) : (
                    <div>No category selected</div>
                  )}
                </div>
              </div>
              <div style={{ color: "#307DF7", scale: "1.5" }}>&gt;&gt;&gt;</div>

              <div className="items_container">
                <div className="items">
                  {newImageUrl ? (
                    <>
                      <span>New icon</span>
                      <img src={newImageUrl} alt="New default icon" />
                    </>
                  ) : (
                    <div>No new icon selected</div>
                  )}
                </div>
              </div>
            </div>
            <div
              className="updateIcon"
              onClick={() => handleConfirmationAction()}
            >
              Update Icon
            </div>
            {showConfirmation && (
              <ConfirmationModal
                message="Are you sure you want to update the icon?"
                cancelMessage="No, keep old icon"
                confirmMessage="Yes, update icon"
                onCancel={handleConfirmationAction}
                onConfirm={handleSubmit}
                colorScheme="#007bff"
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDefaultIcon;
