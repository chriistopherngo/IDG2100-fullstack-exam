import React from "react";
import { IoIosMail } from "react-icons/io";
import { LiaUniversitySolid } from "react-icons/lia";

const ManageUsersTable = ({ users, handleSelectUser }) => {
  return (
    <>
    <div className="manage_users_container_outer">
      <div className="manage_users_container">
        {users.map((user, index) => (
          <div key={index} className="manage_users_card">
            <div
              className="user_row"
              onClick={() => handleSelectUser(user)}
            >
              <div className="user_name_pic">
                <div>
                  <img className="user_pic" src="../../../img/profile_user.png" alt="" />
                </div>
                <div className="user_hero">
                  <div className="user_full_name">
                    <div>{user.fName.charAt(0).toUpperCase() + user.fName.slice(1)}</div>
                    <div>{user.lName.charAt(0).toUpperCase() + user.lName.slice(1)}</div>
                  </div>
                  <div>
                    <div className="user_position">{user.position}</div>
                  </div>
                </div>
              </div>

              <div className="user_details">
                <div className="user_data mail">
                  <IoIosMail />
                  {user.email}
                </div>

                <div className="user_data uni_dep">
                <LiaUniversitySolid />
                  <p>{user.university.charAt(0).toUpperCase() + user.university.slice(1)}</p>
                  <span>•</span>
                  <p>{user.department.charAt(0).toUpperCase() + user.department.slice(1)}</p>
                </div>
                <div className="user_data last">{user.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default ManageUsersTable;
