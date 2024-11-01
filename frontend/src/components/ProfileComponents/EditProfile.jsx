import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";
import { IoMdClose } from "react-icons/io";
import getConfig from "../../utils/getConfig";
import instance from "../../utils/axios";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const EditProfile = ({ user, setUser, onSubmit, onClickCloseModal }) => {
  const [editPassword, setEditPassword] = useState(false);
  const [error, setError] = useState("");
  const { token, deleteCurrentUser } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Function to show/hide the password fields
  const handleShowPassword = () => {
    setEditPassword(!editPassword);
    // Clear the password fields if the user cancels the edit
    if (editPassword) {
      setFormData({ ...formData, password: "", confirmPassword: "" });
    }
  };

  // Form data state to mimic the user object
  const [formData, setFormData] = useState({
    fName: user.fName || "",
    lName: user.lName || "",
    email: user.email || "",
    university: user.university || "",
    department: user.department || "",
    password: "",
    confirmPassword: "",
  });

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Check if the passwords match
    if (formData.password && formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match");
      setError("Passwords do not match");
      return;
    }

    // Check if the password is at least 8 characters long
    if (formData.password && formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // check if no changes have been made to the form
    if (
      formData.fName === user.fName &&
      formData.lName === user.lName &&
      formData.email === user.email &&
      formData.university === user.university &&
      formData.department === user.department &&
      !formData.password
    ) {
      setError("No changes have been made");
      return;
    }

    // assign the form data to a new object and remove confirmPassword
    const payload = { ...formData };
    // Remove confirmPassword before sending
    delete payload.confirmPassword;

    if (!editPassword) {
      // If password is not being edited, use the existing password
      payload.password = user.password;
    }

    instance
      .put(`/api/user/update/${user._id}`, payload, getConfig(token))
      .then((res) => {
        // Update the user state with the response data
        setUser(res.data);
        setError(null);
        onSubmit();
      })
      .catch((error) => {
        console.error("ERROR", error.response.data);
        setError(error.response.data);
      });
  };

  return (
    <>
      <div className="modal">
        <div className="edit-user-form-outer">
          <form className="edit-user-form" onSubmit={submitForm}>
            <div className="close_card">
              <div className="iconPlusText" onClick={onClickCloseModal}>
                <IoMdClose size={30} /> <span>Close</span>
              </div>
            </div>
            <label htmlFor="fName">First Name:</label>
            <input
              type="text"
              id="fName"
              name="fName"
              value={formData.fName}
              required
              onChange={handleChange}
            />

            <label htmlFor="lName">Last Name:</label>
            <input
              type="text"
              id="lName"
              name="lName"
              value={formData.lName}
              required
              onChange={handleChange}
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
            />

            <label htmlFor="university">University:</label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              required
              onChange={handleChange}
            />

            <label htmlFor="department">Department:</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              required
              onChange={handleChange}
            />

            <button
              className="button-26 editPwd"
              type="button"
              onClick={handleShowPassword}
            >
              {editPassword ? "Cancel Edit Password" : "Edit Password"}
            </button>

            {editPassword && (
              <>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </>
            )}

            <button className="button-26" type="submit">
              Confirm Changes
            </button>

            <button
              className="scheme_btns delete"
              type="button"
              onClick={() => {
                setShowConfirmation(true);
              }}
            >
              Delete Account
            </button>
          </form>

          {showConfirmation && (
            <ConfirmationModal
              message="Are you sure you want to delete your acccount?"
              cancelMessage="No, go back"
              confirmMessage="Yes, Delete my account"
              onCancel={() => {
                setShowConfirmation(false);
              }}
              onConfirm={() => deleteCurrentUser(user._id)}
            />
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default EditProfile;
