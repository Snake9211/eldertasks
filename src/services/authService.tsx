import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

// Example in authService.tsx
import { CustomUser } from "../types";
import { auth } from "../firebase";

const firestore = getFirestore();

// Login function with Firestore user data fetch
export const login = async (email: string, password: string): Promise<CustomUser> => {
  try {
    console.log("Attempting to log in with email:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User authenticated with UID:", user.uid);

    // Attempt to fetch additional user data from Firestore
    const userRef = doc(firestore, "Users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      console.log("User data from Firestore:", userData);

      // Merge Firebase Auth and Firestore data with double assertion
      return { ...user, ...userData } as unknown as CustomUser;
    } else {
      console.warn("User data not found in Firestore, proceeding with auth data only");

      // Return just Firebase Auth data if no Firestore data found
      return user as unknown as CustomUser;
    }
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid email or password"); // Custom error message for invalid login
  }
};

// Create user profile function
export const createUserProfile = async (user: CustomUser, additionalData: any = {}) => {
  if (!user) return;

  const userRef = doc(firestore, "Users", user.uid); // Use UID as document ID
  const { familyId } = additionalData; 

  try {
    await setDoc(userRef, {
      id: user.uid,              // Store the UID as the 'id' field
      displayName: user.displayName,
      email: user.email,
      familyId: familyId || null, // Include familyId if provided
      createdAt: new Date(),
      ...additionalData,          // Additional data like membership, etc.
    });
    console.log("User profile created successfully with id and familyId.");
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

// Fetch user profile function
export const fetchUserProfile = async (): Promise<CustomUser | null> => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(firestore, "Users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      console.log("Fetched user data:", userSnapshot.data());
      // Use 'as unknown as CustomUser' to force the type
      return { ...user, ...userSnapshot.data() } as unknown as CustomUser;
    } else {
      console.log("No such user document!");
      return null;
    }
  } else {
    console.log("No user is signed in.");
    return null;
  }
};

// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Auth state change listener
export const onAuthStateChangedListener = (callback: (user: CustomUser | null) => void) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch full user data, including Firestore fields, if available
        const userWithProfile = await fetchUserProfile();
        callback(userWithProfile as CustomUser); // Provide user data with Firestore fields to the callback
      } else {
        callback(null);
      }
    });
  };