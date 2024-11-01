import React, { useState } from "react";
import "./CardEditForm.css";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import instance from "../../utils/axios";
import getConfig from "../../utils/getConfig";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const CardEditForm = ({
  selectedCard,
  onClose,
  onUpdateCard,
  onDeleteCard,
  onNotify,
}) => {
  const [editFormData, setEditFormData] = useState(selectedCard);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    `http://localhost:5353/${selectedCard.card_icon}`
  );
  const [file, setFile] = useState(null);
  const { token } = useAuth();

  // function to close the modal
  const handleClose = () => {
    onClose();
  };

  const handleFormChange = (event) => {
    // update the form data when the input fields change
    const { name, value } = event.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      // update the image being displayed
      setImageUrl(newImageUrl);
      // update the file being uploaded
      setFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // create a new form data object to submit
    const submitData = new FormData();
    submitData.append("card_id", editFormData.card_id);
    submitData.append("card_type", editFormData.card_type);
    submitData.append("card_name", editFormData.card_name);
    submitData.append("card_description", editFormData.card_description);

    if (file) {
      submitData.append("card_icon", file);
    } else {
      submitData.append("card_icon", editFormData.card_icon);
    }

    if (editFormData.card_type === "assessment") {
      submitData.append("card_category", editFormData.card_category);
      submitData.append("card_details", editFormData.card_details);
    }

    try {
      // make a put request to update the card
      await instance.put(
        `api/${editFormData.card_type}/${selectedCard.card_id}`,
        submitData,
        getConfig(token)
      );
      // update the card list with the updated card
      onUpdateCard(editFormData);
      onNotify(`Card with id ${selectedCard.card_id} updated!`);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  // function to open the delete confirmation modal
  const openDeleteConfirmation = (event) => {
    event.preventDefault();
    setShowConfirmation(true);
  };

  // function to close the delete confirmation modal
  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  // function to delete the selected card
  const handleDeleteCard = (selectedCard) => {
    onDeleteCard(selectedCard);
    onNotify(`Card successfully deleted!`);
  };

  return (
    <>
      <div className="modal versionTwo">
        <div className="close_card versionTwo">
          <div className="iconPlusText" onClick={handleClose}>
            <IoMdClose size={30} /> <span>Close</span>
          </div>
        </div>
        <form className="edit_card versionTwo" onSubmit={handleSubmit}>
          <div className="edit-fields-container">
            {selectedCard.card_type === "mission" && (
              <div className="card_typeForMission">
                {selectedCard.card_type}
              </div>
            )}

            <div className="edit-field icon">
              <div className="current_icon_container">
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt="Current Icon"
                  className="current_icon"
                />
              </div>
              <input
                type="file"
                name="card_icon"
                onChange={handleImageChange}
              />
            </div>

            <div className="edit-field name">
              <input
                style={{ border: "0.5px solid #000", padding: "5px" }}
                type="text"
                name="card_name"
                value={editFormData.card_name}
                onChange={handleFormChange}
              />
            </div>
            <div className="edit-field description">
              <textarea
                style={{ border: "0.5px solid #000", padding: "5px" }}
                type="text"
                name="card_description"
                value={editFormData.card_description}
                onChange={handleFormChange}
              />
            </div>
            {editFormData.card_type === "mission" && (
              <>
                <div className="whitebox editform"></div>
              </>
            )}
            {editFormData.card_type === "assessment" && (
              <>
                <div className="edit-field category">
                  <div className="select-container">
                    <select
                      name="card_category"
                      value={editFormData.card_category}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Category</option>
                      <option value="who is assessed">Who is Assessed</option>
                      <option value="the assessor">The Assessor</option>
                      <option value="assessment artefact">
                        Assessment Artefact
                      </option>
                      <option value="assessment format">
                        Assessment Format
                      </option>
                      <option value="assessment context">Context</option>
                      <option value="assessment timing">
                        Assessment Timing
                      </option>
                    </select>
                  </div>
                </div>
                <div className="edit-field details">
                  <textarea
                    style={{ border: "0.5px solid #000", padding: "5px" }}
                    type="text"
                    name="card_details"
                    value={editFormData.card_details}
                    onChange={handleFormChange}
                  />
                </div>
              </>
            )}
          </div>

          <edit-super-assessment-card
            card-id={selectedCard.card_id}
            card-type={selectedCard.card_type}
            card-name={editFormData.card_name}
            card-category={editFormData.card_category}
            card-description={editFormData.card_description}
            card-details={editFormData.card_details}
          />
          <div className="operations_container">
            <button
              type="submit"
              className="button-26 nonScaled delete"
              onClick={openDeleteConfirmation}
            >
              Delete Card
            </button>
            <button
              type="submit"
              className="button-26 nonScaled"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </form>

        {showConfirmation && (
          <ConfirmationModal
            message="Are you sure you want to delete this card?"
            cancelMessage="No, keep card"
            confirmMessage="Yes, Delete"
            onCancel={handleCancelDelete}
            onConfirm={handleDeleteCard}
          />
        )}
      </div>
    </>
  );
};

export default CardEditForm;
