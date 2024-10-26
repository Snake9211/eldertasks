import React, { createContext, useContext, useState } from "react";

interface FamilyContextProps {
  familyId: string;
  setFamilyId: React.Dispatch<React.SetStateAction<string>>;
}

const FamilyContext = createContext<FamilyContextProps | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [familyId, setFamilyId] = useState("sampleFamilyId"); // Initialize with your default family ID

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