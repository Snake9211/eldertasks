import React, { ReactNode, createContext, useContext, useState } from "react";

import { User as FirebaseUser } from "firebase/auth"; // Import Firebase User type

// Define a custom type that extends Firebase's User with familyId
interface CustomUser extends FirebaseUser {
  familyId: string;
}

interface UserContextType {
  user: CustomUser | null;
  setUser: (user: CustomUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};