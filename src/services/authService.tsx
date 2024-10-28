import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

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
// createUserProfile function to store Firestore-specific fields
export const createUserProfile = async (
  email: string,
  displayName: string, 
  id: string,
  additionalData: Partial<CustomUser>
): Promise<void> => {

  const userRef = doc(firestore, "Users", id); // Use Firebase UID as the Firestore document ID
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    const createdAt = Math.floor(Date.now() / 1000);

    const firestoreData: CustomUser = {
      id: id,
      familyId: additionalData.familyId || "", // Optional family ID or an empty string
      createdAt,
      displayName: displayName || additionalData.displayName || "Guest",
      email: email || "",
      // Include any other additional fields as needed
      ...additionalData,
    };

    try {
      await setDoc(userRef, firestoreData);
      console.log("User profile created successfully in Firestore");
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  }
};

export const fetchUserProfile = async (): Promise<CustomUser | null> => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(firestore, "Users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const firestoreData = userSnapshot.data() as CustomUser;
      console.log("Fetched user data:", firestoreData);
      
      return firestoreData;
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