import {
  Alert,
  Box,
  Button,
  Container,
  Alert as MuiAlert,
  Link as MuiLink,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { FormEvent, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const firestore = getFirestore();

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleLogin = async () => {
    setErrorMessage(null);
    try {
      const firebaseUser = await login(email, password);

      const userDoc = await getDoc(doc(firestore, "Users", firebaseUser.id));
      if (userDoc.exists()) {
        const { familyId } = userDoc.data();
        const userWithFamilyId = { ...firebaseUser, familyId };
        setUser(userWithFamilyId);
        setSnackbar({
          open: true,
          message: "Logged in successfully!",
          severity: "success",
        });
        navigate("/home"); // Redirect to Home page
      } else {
        setErrorMessage("User profile data not found.");
        console.warn("User data not found in Firestore");
      }
    } catch (error: any) {
      const errorMsg =
        error.code === "auth/wrong-password" || error.code === "auth/user-not-found"
          ? "Invalid email or password."
          : "An error occurred. Please try again.";
      setErrorMessage(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error",
      });
      console.error("Login error:", error);
    }
  };

  // Redirect to Sign-Up page
  const handleSignUp = () => {
    navigate("/signup");
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    handleLogin(); // Call the login handler
  };

  // Handle Snackbar close
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          padding: 4,
          backgroundColor: "background.paper",
          color: "text.primary",
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Please login to your account
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              sx: { color: "text.secondary" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              sx: { color: "text.secondary" },
            }}
          />
          <Button
            type="submit" // Change to submit type
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account?{" "}
            <MuiLink
              component="button"
              variant="body2"
              onClick={handleSignUp}
            >
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Login;