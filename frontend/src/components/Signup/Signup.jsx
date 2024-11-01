// Necessary imports
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";
import "./Signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Functional component
const Signup = () => {
  // State hook variables
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const notify = (errMessage) => toast.error(errMessage);

  // Handle user registration
  const handleSaveUser = () => {
    // Validation
    if (
      !fName ||
      !lName ||
      !email ||
      !password ||
      !university ||
      !department ||
      !position
    ) {
      const errMessage = "All fields marked with * must be filled";
      notify(errMessage);
      return;
    }

    // User data object
    const data = {
      fName,
      lName,
      email,
      password,
      university,
      department,
      position,
    };
    // Sending POST request to register user
    instance
      .post("api/auth/register", data)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        // Checking if email is already taken
        if (error.response && error.response.status === 409) {
          setError(error.response.data)
          const errMessage = "This email is already taken.";
          notify(errMessage);
        } else if (error.response && error.response.data.includes("minimum eight")){
          setError(error.response.data)
          const errMessage = error.response.data
          notify(errMessage);
        } else {
          setError(error.response.data);
          const errMessage =
            "Please use the email format: example@example.com.";
          notify(errMessage);
        }
      });
  };

  return (
    <>
      <div className="signup_form">
        <h2>Create an account</h2>
        {/* <div className="error">{error}</div> */}
        <div className="text_container">
          <div className="signup_form_left">
            <input
              type="text"
              name="fName"
              id="fName"
              placeholder="* First name"
              value={fName}
              onChange={(e) => setfName(e.target.value)}
            />
            <input
              type="text"
              name="lName"
              id="lName"
              placeholder="* Last name"
              value={lName}
              onChange={(e) => setlName(e.target.value)}
            />
            <input
              className={`${error && error.includes("format") || error && error.includes("exists") ? "errorBorder" : ""}`}
              type="email"
              name="email"
              id="email"
              placeholder="* Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="signup_form_right">
            <input
            className={`${error && error.includes("minimum eight") ? "errorBorder" : ""}`}
              type="password"
              name="password"
              id="password"
              placeholder="* Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              name="university"
              id="university"
              placeholder="* University"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
            <input
              type="text"
              name="department"
              id="department"
              placeholder="* Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
        </div>

        <h3>* Select your position</h3>

        <div className="radio_container">
          <div>
            {" "}
            <input
              type="radio"
              id="student"
              value="Student"
              checked={position === "Student"}
              onChange={(e) => setPosition(e.target.value)}
            />
            <label htmlFor="student">Student</label>
          </div>

          <div>
            <input
              type="radio"
              id="teacher"
              value="Teacher"
              checked={position === "Teacher"}
              onChange={(e) => setPosition(e.target.value)}
            />
            <label htmlFor="teacher">Teacher</label>
          </div>

          <div>
            <input
              type="radio"
              id="ta"
              value="TA"
              checked={position === "TA"}
              onChange={(e) => setPosition(e.target.value)}
            />
            <label htmlFor="ta">TA</label>
          </div>
        </div>

        <button
          className="button-26 nonScaled"
          role="button"
          onClick={handleSaveUser}
        >
          Sign up
        </button>
        <p>
          Already have an account? Log in <Link to={"/login"}>here</Link>
        </p>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
