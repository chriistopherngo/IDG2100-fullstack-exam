// Necessary imports
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import instance from "../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Functional component
const Login = () => {
  // State hook variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const notify = (errMessage) => toast.error(errMessage);

  // Handle user login
  const handleLogin = async () => {
    // Sending POST request to login endpoint
    try {
      const response = await instance.post(
        "api/auth/login",
        { email, password } // Request body contatining email and password
      );

      // Extracting token from response data
      const token = response.data.accessToken;
      // If token exists,
      if (token) {
        login(token); // Use the login function from AuthContext
        if (token) {
          // Decoding JWT token
          const decoded = jwtDecode(token);

          // Redirect to URL, based on role
          const redirectTo =
            decoded.role === "Administrator" ? "/dashboard" : "/main-game";
          navigate(redirectTo);
        }
      } else {
        console.error("Token not found in response:", response.data);
      }
    } catch (error) {
      if (!email || !password) {
        const errMessage = "Please log in with email and password.";
        notify(errMessage);
      } else {
        const errMessage = "Invalid email or password.";
        notify(errMessage);
      }
    }
  };

  return (
    <>
      <div className="login_form">
        <form className="login_form-form">
          <label>Log in to continue</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        <button
          className="button-26 nonScaled"
          role="button"
          type="submit"
          onClick={() => handleLogin()}
        >
          Log in
        </button>
        <p>
          Don't have a user? Sign up <Link to={"/signup"}>here</Link>
        </p>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
