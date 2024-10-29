import React, { createContext, useContext, useState } from "react";

import { useUser } from "./UserContext";

interface FamilyContextProps {
  familyId: string;
  setFamilyId: React.Dispatch<React.SetStateAction<string>>;
}

const FamilyContext = createContext<FamilyContextProps | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const [familyId, setFamilyId] = useState(currentUser ? currentUser.familyId : "defaultFamilyId");
  
  return (
    <FamilyContext.Provider value={{ familyId, setFamilyId }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamilyContext = (): FamilyContextProps => {
  const context = useContext(FamilyContext);
  if (!context) throw new Error("useFamilyContext must be used within a FamilyProvider");
  return context;
};