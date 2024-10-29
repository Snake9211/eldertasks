import {
  Alert,
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
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
import React, { useState } from "react";

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

  // Function to generate a random family code
  function generateFamilyCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
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
    let code = '';
    let exists = true;
    while (exists) {
      code = generateFamilyCode(length);
      const codeQuery = query(familiesRef, where('familyCode', '==', code));
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
        const codeQuery = query(familiesRef, where("familyCode", "==", familyCodeInput));
        const codeSnapshot = await getDocs(codeQuery);

        if (!codeSnapshot.empty) {
          // Family found, associate user with this family
          const familyDoc = codeSnapshot.docs[0];
          familyId = familyDoc.id;
          familyCode = familyDoc.data().familyCode;
          console.log("Joined family with ID:", familyId);
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
          console.log("Created new family with ID:", familyId);
        } else {
          // Family exists, get the familyId
          const familyDoc = querySnapshot.docs[0];
          familyId = familyDoc.id;
          familyCode = familyDoc.data().familyCode;
          console.log("Found existing family with ID:", familyId);
        }
      }

      // Create user profile in Firestore with additional info
      await createUserProfile( user.email as string, user.displayName as string, user.uid, { familyId: familyId, displayName: displayName });      
      console.log("User profile created:", user.uid);

      navigate("/"); // Redirect to the home page after successful sign-up
    } catch (error) {
      const errorMsg =
        (error as Error).message || "An error occurred. Please try again.";
      setErrorMessage(errorMsg);
      console.error("Sign-up error:", error);
    }
  };

  // Function to redirect to login page
  const handleLoginRedirect = () => {
    navigate("/login");
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
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Create an Account
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Box component="form" noValidate>
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
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSignUp}
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
    </Container>
  );
};

export default SignUp;