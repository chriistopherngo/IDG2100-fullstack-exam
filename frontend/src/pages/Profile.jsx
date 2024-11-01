import { useState, useEffect } from "react";
import EditProfile from "../components/ProfileComponents/EditProfile";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import instance from "../utils/axios";
import Loading from "../utils/Loading";
import UserSchemes from "../components/ProfileComponents/UserSchemes";
import { IoIosMail } from "react-icons/io";
import { LiaUniversitySolid } from "react-icons/lia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getConfig from "../utils/getConfig";

const Profile = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [toggleEditProfile, setToggleEditProfile] = useState(false);

  useEffect(() => {
    const decoded = jwtDecode(token);
    instance
      .get(`api/user/${decoded._id}`, getConfig(token))
      .then((res) => {
        setUser(res.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [token]);

  if (!user) {
    return <Loading />;
  }

  const handleCloseToggleEdit = () => {
    setToggleEditProfile(false);
  };

  const handleToast = () => {
    setToggleEditProfile(false);
    toast.success("User updated successfully");
  };

  return (
    <>
      <ToastContainer position="bottom-right" theme="colored" />
      <div>
        <div className={`user_card profile_page`}>
          <div className="card_hero">
            {!toggleEditProfile && (
              <div className="button-cont">
                <button
                  onClick={() => setToggleEditProfile(!toggleEditProfile)}
                >
                  Edit Profile
                </button>
              </div>
            )}

            {toggleEditProfile && (
              <EditProfile
                user={user}
                setUser={setUser}
                onSubmit={handleToast}
                onClickCloseModal={handleCloseToggleEdit}
              />
            )}
            <img
              className="user_pic"
              src="../../../img/profile_user.png"
              alt=""
            />
            <div className="name_container">
              <p className="fName">
                {user.fName.charAt(0).toUpperCase() + user.fName.slice(1)}
              </p>
              <p className="lName">
                {user.lName.charAt(0).toUpperCase() + user.lName.slice(1)}
              </p>
            </div>
            <p className="selectedUser_position">{user.position}</p>
          </div>

          <p className="email_container">
            <IoIosMail />
            {user.email}
          </p>
          <div className="university_department_container">
            <LiaUniversitySolid />
            <p>
              {user.university.charAt(0).toUpperCase() +
                user.university.slice(1)}
            </p>
            <span>•</span>
            <p>
              {user.department.charAt(0).toUpperCase() +
                user.department.slice(1)}
            </p>
          </div>
        </div>
      </div>

      {user.position === "Teacher" && (
        <div className="schemes_display">
          <h2 className="bookied_schemes">{user.fName}'s Schemes</h2>
          <UserSchemes />
        </div>
      )}
    </>
  );
};

export default Profile;
