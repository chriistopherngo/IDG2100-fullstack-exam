import React, { useState } from "react";
import "./EditIconByCategory.css";
import { useAuth } from "../../context/AuthContext";
import instance from "../../utils/axios";
import getConfig from "../../utils/getConfig";
import { IoMdClose } from "react-icons/io";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const EditIconByCategory = ({ selectedItems, onClose, onNotify }) => {
  const [file, setFile] = useState(null);
  // previeews the current image of the selected card
  const [imageUrl, setImageUrl] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const { token } = useAuth();

  // Function to handle the preview and set the uploaded image
  const handleIconChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
      setFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a form data object to send the file
    const formData = new FormData();
    // Append the card id to the form data object
    selectedItems.map((selectedItem) => {
      formData.append("card_id", selectedItem.card_id);
    });
    // Append the file to the form data object
    formData.append("card_icon", file);
    try {
      await instance.put(
        `api/bulk/edit-${selectedItems[0].card_type}`,
        formData,
        getConfig(token)
      );
      // Close the modal
      onClose();
      onNotify(`${selectedItems.length} cards updated!`);
    } catch (error) {
      console.error("Error updating category icon:", error);
    }
  };
  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="editIconByCategory-container">
        <div className="edit-card-container bulk">
          <div className="editIconByCategory-input-container">
            <div className="close_card versionTwo bulkEditIcon">
              <div className="iconPlusText" onClick={() => onClose()}>
                <IoMdClose size={30} /> <span>Close</span>
              </div>
            </div>
            <input
              type="file"
              name="new_card_icon"
              onChange={handleIconChange}
              className="icon-file-input"
              id="fileInput"
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "18px", marginBottom: "20px" }}>
                Change new icon for {`${selectedItems.length} cards`}
              </label>
              <label htmlFor="fileInput" className="file-input-label">
                Choose file
              </label>
            </div>
          </div>
          <div className="editIconByCategory-image-container">
            {imageUrl ? (
              <img
                key={imageUrl}
                src={imageUrl}
                alt="Current Icon"
                className="current_icon"
              />
            ) : (
              <p style={{ textAlign: "center" }}>Please select an icon</p>
            )}

            {file == null ? (
              ""
            ) : (
              <p style={{ textAlign: "center" }}>Selected icon</p>
            )}
          </div>

          <div
            className="changeIcons"
            onClick={() => setConfirmationModal(true)}
          >
            Change icon
          </div>
          {confirmationModal && (
            <ConfirmationModal
              message="Are you sure you want to update icons?"
              cancelMessage="No, keep old icons"
              confirmMessage="Yes, Update"
              onCancel={() => setConfirmationModal(false)}
              onConfirm={handleSubmit}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default EditIconByCategory;
