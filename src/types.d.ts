import { User as FirebaseUser } from "firebase/auth"; // Use Firebase's User type for authentication

declare module "*.svg" {
    const content: any;
    export default content;
}

// Extend Firebase's User type to include Firestore fields
export interface CustomUser {
    familyId: string;
    displayName: string | null; 
    email: string;
    id: string;
    membership?: string;
    createdAt: number;
}

// Type for the "Tasks" collection
export interface Task {
    id: string; // Custom ID or Firestore generated ID
    name: string;
    description: string;
    familyId: string;
    status: "incomplete" | "completed"; // Define status as specific strings
    createdAt: number; // Unix time in seconds
}

// Type for the "SuggestedTasks" collection
export interface SuggestedTask {
    id: string; // Custom or Firestore-generated ID
    name: string;
    description: string;
    estimated_cost: number;
    status: "pending" | "completed"; // Define status as specific strings
}

// Type for the "Families" collection
export interface Family {
    id: string; // Firestore document ID
    surname: string;
}