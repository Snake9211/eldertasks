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


export interface Task {
    createdAt: any;
    id: string;
    name: string;
    dueDate?: string;
    status: string;
    fee?: number;
    description?: string;
    familyId?: string;       // Added to associate the task with a family
    isSuggested?: boolean;   // Added to differentiate suggested tasks
  }
  
  export interface SuggestedTask {
    id: string;
    name: string;
    dueDate?: string;
    fee?: number;
    description?: string;
    isSuggested: boolean;    // Typically always true for suggested tasks
  }

// Type for the "Families" collection
export interface Family {
    id: string; // Firestore document ID
    surname: string;
}