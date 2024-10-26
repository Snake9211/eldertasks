import "./Login.css";

import React, { useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { login } from "../services/authService";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { useUser } from "../context/UserContext";

const firestore = getFirestore();

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUser } = useUser();
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleLogin = async () => {
    setErrorMessage(null); // Reset any previous error messages
    try {
      const firebaseUser = await login(email, password);

      // Fetch the familyId from Firestore based on the user's UID
      const userDoc = await getDoc(doc(firestore, "Users", firebaseUser.uid));
      if (userDoc.exists()) {
        const { familyId } = userDoc.data();
        const userWithFamilyId = { ...firebaseUser, familyId };
        setUser(userWithFamilyId); // Set user in context
        console.log("Logged in as:", userWithFamilyId);
        navigate("/"); // Redirect to home or main page
      } else {
        setErrorMessage("User profile data not found.");
        console.warn("User data not found in Firestore");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      setErrorMessage(errorMessage === "Invalid email or password" ? errorMessage : "An error occurred. Please try again.");
      console.error("Login error:", errorMessage);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back</h2>
      <p className="login-subtitle">Please login to your account</p>
      <input
        type="email"
        placeholder="Email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={handleLogin}>Login</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Login;