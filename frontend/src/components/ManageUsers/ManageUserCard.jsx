import React, { useState, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import { LiaUniversitySolid } from "react-icons/lia";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

// Define functional component with props
const ManageUserCard = ({
  selectedUser,
  onEditUser,
  onDeleteUser,
  onClose,
  onNotify,
}) => {
  // State variables
  const [editedRole, setEditedRole] = useState("");
  const [editedPosition, setEditedPosition] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Hook to update edited role state when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setEditedRole(selectedUser.role);
      setEditedPosition(selectedUser.position);
    } else {
      setEditedRole("");
      setEditedPosition("");
    }
  }, []);

  // Event handler for changing edited role
  const handleRoleChange = (e) => {
    setEditedRole(e.target.value);
  };

  // Event handler for changing edited position
  const handlePositionChange = (e) => {
    setEditedPosition(e.target.value);
  };

  // Event handler for saving user edits
  const handleSave = () => {
    const updatedData = {
      role: editedRole,
      position: editedPosition,
    };
    onEditUser(selectedUser._id, updatedData);
    // Show an appropriate toast message depending on what user details are changed
    if (
      editedRole != selectedUser.role &&
      editedPosition != selectedUser.position
    ) {
      onNotify(
        `Role and position for ${
          selectedUser.fName.charAt(0).toUpperCase() +
          selectedUser.fName.slice(1)
        } ${
          selectedUser.lName.charAt(0).toUpperCase() +
          selectedUser.lName.slice(1)
        } updated!`
      );
    } else if (editedRole != selectedUser.role) {
      onNotify(
        `Role for ${
          selectedUser.fName.charAt(0).toUpperCase() +
          selectedUser.fName.slice(1)
        } ${
          selectedUser.lName.charAt(0).toUpperCase() +
          selectedUser.lName.slice(1)
        } updated!`
      );
    } else if (editedPosition != selectedUser.position) {
      onNotify(
        `Position for ${
          selectedUser.fName.charAt(0).toUpperCase() +
          selectedUser.fName.slice(1)
        } ${
          selectedUser.lName.charAt(0).toUpperCase() +
          selectedUser.lName.slice(1)
        } updated!`
      );
    } else {
      toast.info("No details changed");
    }
    onClose();
  };

  // Event handler for when delete button / bin is clicked
  const handleDelete = () => {
    setShowConfirmation(true);
  };

  // Event handler for confirming user deletion
  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    onDeleteUser(selectedUser._id);
    onNotify(
      `User ${
        selectedUser.fName.charAt(0).toUpperCase() + selectedUser.fName.slice(1)
      } ${
        selectedUser.lName.charAt(0).toUpperCase() + selectedUser.lName.slice(1)
      } deleted!`
    );
    onClose();
  };

  // Event handler for cancelling user deletion
  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <div className="modal">
        <div className={`user_card ${showConfirmation ? "blur" : ""}`}>
          <div className="close_card">
            {" "}
            <div className="iconPlusText" onClick={handleClose}>
              <IoMdClose size={30} /> <span>Close</span>
            </div>
          </div>
          <div className="card_hero">
            <img
              className="user_pic"
              src="../../../img/profile_user.png"
              alt=""
            />
            <div className="name_container">
              <p className="fName">
                {selectedUser.fName.charAt(0).toUpperCase() +
                  selectedUser.fName.slice(1)}
              </p>
              <p className="lName">
                {selectedUser.lName.charAt(0).toUpperCase() +
                  selectedUser.lName.slice(1)}
              </p>
            </div>
          </div>

          <p className="email_container">
            <IoIosMail />
            {selectedUser.email}
          </p>
          <div className="university_department_container">
            <LiaUniversitySolid />
            <p>
              {selectedUser.university.charAt(0).toUpperCase() +
                selectedUser.university.slice(1)}
            </p>
            <span>•</span>
            <p>
              {selectedUser.department.charAt(0).toUpperCase() +
                selectedUser.department.slice(1)}
            </p>
          </div>
          <div className="select-wrapper">
            <select
              name="position"
              value={editedPosition}
              onChange={handlePositionChange}
              className="custom-select"
            >
              <option value="Student">Student</option>
              <option value="TA">TA</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          <div className="select-wrapper">
            <select
              name="role"
              value={editedRole}
              onChange={handleRoleChange}
              className="custom-select"
            >
              <option value="User">User</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          <div className="operations_container">
            <div className="iconPlusText delete" onClick={handleDelete}>
              <MdDeleteOutline /> <span>Delete</span>
            </div>
            <button
              className="button-26 nonScaled"
              role="button"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {showConfirmation && ( // Rendering confirmation modal if showConfirmation is true
        <ConfirmationModal
          message={`Are you sure you want to delete "${selectedUser.fName} ${selectedUser.lName}"?`}
          cancelMessage="Cancel"
          confirmMessage="Yes, delete"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default ManageUserCard;
