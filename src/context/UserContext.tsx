import React, { createContext, useContext, useEffect, useState } from "react";

import { CustomUser } from "../types";
import { auth } from "../firebase";
import { fetchUserProfile } from "../services/authService";
import { onAuthStateChanged } from "firebase/auth";

interface UserContextType {
  currentUser: CustomUser | null;
  setUser: React.Dispatch<React.SetStateAction<CustomUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const fullProfile = await fetchUserProfile();
        setCurrentUser(fullProfile);
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setUser: setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};