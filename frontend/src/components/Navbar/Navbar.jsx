import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { userRole, logout } = useAuth();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

  useEffect(() => {
    const path = location.pathname;

    // Set active link based on the current path, used to stylistically highlight the active link
    if (path.startsWith("/dashboard/manageusers")) {
      setActiveLink("manageusers");
    } else if (path.startsWith("/dashboard")) {
      setActiveLink("dashboard");
    } else if (path.startsWith("/main-game")) {
      setActiveLink("maingame");
    } else if (path.startsWith("/profile")) {
      setActiveLink("profile");
    } else if (path.startsWith("/public-schemes")) {
      setActiveLink("publicschemes");
    } else if (path.startsWith("/pdf-generator")) {
      setActiveLink("userpdf");
    } else {
      setActiveLink("");
    }
  }, [location.pathname]);


  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav>
        <div className="logo">
          <ul>
            <Link to="/">
              <img src="../../../public/student.svg" alt="student icon" />
            </Link>

            <li>Super Assessor</li>
          </ul>
        </div>

        <div className={`links ${isMenuOpen ? "open" : ""}`}>
          <div className="menu-icon" onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <ul>
            {userRole === "Administrator" && (
              <>
                <li onClick={toggleMenu}>
                  <Link
                    to="/dashboard"
                    className={activeLink === "dashboard" ? "active" : ""}
                  >
                    Dashboard
                  </Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link
                    to="/dashboard/manageusers"
                    className={activeLink === "manageusers" ? "active" : ""}
                  >
                    Manage Users
                  </Link>
                </li>
              </>
            )}
            {userRole === "User" && (
              <>
                <li onClick={toggleMenu}>
                  <Link
                    to="/pdf-generator"
                    className={activeLink === "userpdf" ? "active" : ""}
                  >
                    PDF Generator
                  </Link>
                </li>
              </>
            )}
            {userRole && (
              <>
                <li onClick={toggleMenu}>
                  <Link
                    to="/main-game"
                    className={activeLink === "maingame" ? "active" : ""}
                  >
                    Main Game
                  </Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link
                    to="/public-schemes"
                    className={activeLink === "publicschemes" ? "active" : ""}
                  >
                    Public Schemes
                  </Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link
                    to="/profile"
                    className={activeLink === "profile" ? "active" : ""}
                  >
                    Profile
                  </Link>
                </li>
              </>
            )}
            {userRole ? (
              <li onClick={toggleMenu}>
                <a href="#logout" className="logout" onClick={handleLogout}>
                  Log Out
                </a>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Log in</Link>
                </li>
                <li className="signupNav">
                  <Link to="/signup">Sign up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
