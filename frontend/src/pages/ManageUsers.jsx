import React, { useState } from "react";
import ManageUsersTable from "../components/ManageUsers/ManageUsersTable";
import ManageUserCard from "../components/ManageUsers/ManageUserCard";
import "../components/ManageUsers/ManageUsers.css";
import useFetchUserData from "../utils/useFetchUserData";
import useEditUser from "../utils/useEditUser";
import useDeleteUser from "../utils/useDeleteUser";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getConfig from "../utils/getConfig";

const ManageUsers = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByRole, setFilterByRole] = useState("All");
  const [filterByPosition, setFilterByPosition] = useState("All");
  const [filterMode, setFilterMode] = useState(false);
  const { token } = useAuth();

  // Fetch user data and define edit and delete user hooks
  const users = useFetchUserData(getConfig(token));
  const editUser = useEditUser(getConfig(token));
  const deleteUser = useDeleteUser(getConfig(token));

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleCloseCard = () => {
    setSelectedUser("");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilter = (role) => {
    setFilterByRole(role);
  };

  const handlePositionFilter = (position) => {
    setFilterByPosition(position);
  };

  const onFilterMode = () => {
    setFilterMode(!filterMode);
    if (filterMode) {
      handleRoleFilter("All"); // If you set turn off filter mode, set all filter back to display All
      handlePositionFilter("All");
      setSearchQuery(""); // If you set turn off filter mode, reset all search to display all cards
    }
  };

  // Filter users by role
  const filteredByRole = users.filter((user) => {
    switch (filterByRole) {
      case "Administrator":
        return user.role === "Administrator";
      case "User":
        return user.role === "User";
      default:
        return true;
    }
  });

  // Filter users by position
  const filteredByPosition = filteredByRole.filter((user) => {
    switch (filterByPosition) {
      case "Teacher":
        return user.position === "Teacher";
      case "Student":
        return user.position === "Student";
      case "TA":
        return user.position === "TA";
      default:
        return true;
    }
  });

  // Filter users by search query
  const searchedUsers = filteredByPosition.filter((user) => {
    const fullName = `${user.fName} ${user.lName}`.toLowerCase();
    const fullNameNoSpace = `${user.fName}${user.lName}`.toLowerCase();
    const email = user.email.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      fullNameNoSpace.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase())
    );
  });

  const notify = (message) =>
    toast.success(message, {
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

  return (
    <>
      {/* Filter mode button and filter controls */}
      <div className="filter-mode-btn manageusers">
        <button
          className={filterMode ? "active" : ""}
          onClick={() => onFilterMode()}
        >
          Filter
        </button>
        {filterMode && (
          <div className="filter_users_container">
            <div className="filter-buttons">
              <button
                onClick={() => handleRoleFilter("All")}
                className={filterByRole === "All" ? "active" : ""}
              >
                Show All Roles
              </button>
              <button
                onClick={() => handleRoleFilter("Administrator")}
                className={filterByRole === "Administrator" ? "active" : ""}
              >
                Only Administrators
              </button>
              <button
                onClick={() => handleRoleFilter("User")}
                className={filterByRole === "User" ? "active" : ""}
              >
                Only Users
              </button>
            </div>
            <div className="filter-buttons position">
              <button
                onClick={() => handlePositionFilter("All")}
                className={filterByPosition === "All" ? "activepos" : ""}
              >
                Show All Positions
              </button>

              <button
                onClick={() => handlePositionFilter("Teacher")}
                className={filterByPosition === "Teacher" ? "activepos" : ""}
              >
                Only Teachers
              </button>

              <button
                onClick={() => handlePositionFilter("Student")}
                className={filterByPosition === "Student" ? "activepos" : ""}
              >
                Only Students
              </button>
              <button
                onClick={() => handlePositionFilter("TA")}
                className={filterByPosition === "TA" ? "activepos" : ""}
              >
                Only TAs
              </button>
            </div>
          </div>
        )}
        {/* Search bar */}
        <input
            className="search_input"
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearch}
          />
      </div>

      {/* Display message if no users match the search query */}
      {searchedUsers.length === 0 && (
        <div className="search_not_found">
          User name or email "<span>{searchQuery}</span>" could not be found.
        </div>
      )}

      <ManageUsersTable
        users={searchedUsers}
        handleSelectUser={handleSelectUser}
      />

      {selectedUser && (
        <ManageUserCard
          selectedUser={selectedUser}
          onEditUser={editUser}
          onDeleteUser={deleteUser}
          onClose={handleCloseCard}
          onNotify={notify}
        />
      )}
      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
};

export default ManageUsers;
