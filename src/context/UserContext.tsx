import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile, onAuthStateChangedListener } from "../services/authService";

import { CustomUser } from "../types";

interface UserContextType {
  currentUser: CustomUser | null;
  setUser: React.Dispatch<React.SetStateAction<CustomUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
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