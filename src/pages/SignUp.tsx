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
import {
  CollectionReference,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { FormEvent, useState } from "react";

import { auth } from "../firebase";
import { createUserProfile } from "../services/authService";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const firestore = getFirestore();

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [surname, setSurname] = useState("");
  const [familyCodeInput, setFamilyCodeInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  // Function to generate a random family code
  function generateFamilyCode(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Updated getUniqueFamilyCode function
  async function getUniqueFamilyCode(
    familiesRef: CollectionReference,
    length: number
  ): Promise<string> {
    let code = "";
    let exists = true;
    while (exists) {
      code = generateFamilyCode(length);
      const codeQuery = query(familiesRef, where("familyCode", "==", code));
      const codeSnapshot = await getDocs(codeQuery);
      exists = !codeSnapshot.empty;
    }
    return code;
  }

  const handleSignUp = async () => {
    setErrorMessage(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user) {
        throw new Error("User not authenticated.");
      }

      const familiesRef = collection(firestore, "Families");
      let familyId: string;
      let familyCode: string;

      if (familyCodeInput) {
        // User provided a family code, attempt to join the family
        const codeQuery = query(
          familiesRef,
          where("familyCode", "==", familyCodeInput)
        );
        const codeSnapshot = await getDocs(codeQuery);

        if (!codeSnapshot.empty) {
          // Family found, associate user with this family
          const familyDoc = codeSnapshot.docs[0];
          familyId = familyDoc.id;
          familyCode = familyDoc.data().familyCode;
        } else {
          setErrorMessage("Invalid family code.");
          return;
        }
      } else {
        // No family code provided, proceed with surname logic
        const q = query(familiesRef, where("surname", "==", surname));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // No family exists with this surname, create a new family
          familyCode = await getUniqueFamilyCode(familiesRef, 6);
          const newFamilyRef = await addDoc(familiesRef, {
            surname,
            familyCode,
          });
          familyId = newFamilyRef.id;
        } else {
          // Family exists, get the familyId
          const familyDoc = querySnapshot.docs[0];
          familyId = familyDoc.id;
          familyCode = familyDoc.data().familyCode;
        }
      }

      // Create user profile in Firestore with additional info
      await createUserProfile(
        user.email as string,
        displayName, // Use the entered displayName
        user.uid,
        { familyId: familyId, displayName: displayName }
      );

      // Automatically log in the user by updating UserContext
      // This should be handled by your UserContext's onAuthStateChangedListener
      // So, you can navigate to Home and the context will update
      setSnackbar({
        open: true,
        message: "Account created successfully!",
        severity: "success",
      });
      window.location.reload();
    } catch (error: any) {
      let errorMsg = "An error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMsg = "Email is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMsg = "Password is too weak.";
      }
      setErrorMessage(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error",
      });
      console.error("Sign-up error:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    handleSignUp(); // Call the signup handler
  };

  // Function to redirect to login page
  const handleLoginRedirect = () => {
    navigate("/login");
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
          mt: 8,
          p: 4,
          backgroundColor: "background.paper",
          color: "text.primary",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          gutterBottom
        >
          Create an Account
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
            label="Display Name"
            variant="outlined"
            autoFocus
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            InputLabelProps={{
              sx: { color: "text.secondary" },
            }}
          />
          <TextField
            margin="normal"
            required={!familyCodeInput}
            fullWidth
            label="Surname"
            variant="outlined"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            InputLabelProps={{
              sx: { color: "text.secondary" },
            }}
            disabled={!!familyCodeInput}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Family Code (Optional)"
            variant="outlined"
            value={familyCodeInput}
            onChange={(e) => setFamilyCodeInput(e.target.value)}
            InputLabelProps={{
              sx: { color: "text.secondary" },
            }}
            helperText="Enter a family code to join an existing family."
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            autoComplete="email"
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
            autoComplete="new-password"
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
            Sign Up
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <MuiLink
              component="button"
              variant="body2"
              onClick={handleLoginRedirect}
            >
              Login
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

export default SignUp;