import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import MainGame from "./pages/MainGame";
import Navbar from "./components/Navbar/Navbar";
import MissingPath from "./pages/MissingPath";
import NewCard from "./components/NewCard/NewCard";
import GameSetup from "./components/GameComponents/GameSetup";
import Game from "./components/GameComponents/Game";
import { GameProvider } from "./components/GameComponents/GameContext";
import PostGame from "./components/GameComponents/PostGame";
import SchemeManagementPage from "./pages/SchemeManagement";
import Profile from "./pages/Profile";
import UserPDFGenerator from "./pages/UserPDFGenerator";
import CookieConsent from "react-cookie-consent";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  const { userRole, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const hideNavbarPaths = ["/game"]; // Define paths where the Navbar should be hidden

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && (
        <Navbar userRole={userRole} />
      )}

      {/*Cookie consent form: https://www.npmjs.com/package/react-cookie-consent  */}

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="cookie-consent"
        style={{
          background: "white",
          height: "15dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1em",
          color: "black",
          borderTop: "1px solid #4e503b",
        }}
        buttonStyle={{
          color: "white",
          fontSize: "1em",
          backgroundColor: "black",
          marginRight: "10vw",
          padding: "4px 8px",
          border: "1px solid #4e503b",
          borderRadius: "5px",
        }}
        expires={150}
      >
        <p style={{ fontWeight: "bold" }}>
          We use cookies to enhance your experience on our platform.
        </p>
        <p>
          This includes tracking user roles (user or admin) and positions within
          the school (student, teacher, TA).
        </p>
        <span>
          By using this website, you agree to our{" "}
          <a href="/privacy-policy">Privacy Policy</a>
        </span>
      </CookieConsent>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/public-schemes" element={<SchemeManagementPage />} />


        {/* Error Route */}
        <Route path="*" element={<MissingPath />} />

        {/* Protected Routes */}
        <Route
          path="/pdf-generator"
          element={
            <ProtectedRoute roles={["User"]}>
              <UserPDFGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["Administrator"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["Administrator", "User"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/add-card"
          element={
            <ProtectedRoute roles={["Administrator"]}>
              <NewCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manageusers"
          element={
            <ProtectedRoute roles={["Administrator"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/main-game"
          element={
            <ProtectedRoute roles={["User", "Administrator"]}>
              <MainGame />
            </ProtectedRoute>
          }
        />

        <Route
          path="/game-setup"
          element={
            <ProtectedRoute roles={["User", "Administrator"]}>
              <GameProvider>
                <GameSetup />
              </GameProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/game"
          element={
            <ProtectedRoute roles={["User", "Administrator"]}>
              <GameProvider>
                <Game />
              </GameProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/game/game-over"
          element={
            <ProtectedRoute roles={["User", "Administrator"]}>
              <GameProvider>
                <PostGame />
              </GameProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
