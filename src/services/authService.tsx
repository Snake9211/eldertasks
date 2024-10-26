import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { auth } from "../firebase";

const firestore = getFirestore();

interface CustomUser extends User {
  familyId?: string;
}

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
      return { ...user, ...userData } as CustomUser; // Merge auth data and Firestore user data
    } else {
      console.warn("User data not found in Firestore, proceeding with auth data only");
      return user as CustomUser; // Return just auth data if no Firestore data found
    }
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid email or password"); // Custom error message for invalid login
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
  return onAuthStateChanged(auth, (user) => {
    callback(user as CustomUser);
  });
};