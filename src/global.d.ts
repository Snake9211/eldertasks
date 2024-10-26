// src/global.d.ts

// Declare a module for Firebase configuration
declare module '../firebase' {
    export const firebaseConfig: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId?: string; // Optional if using analytics
    };

    export const firebaseApp: any; 
    export const db: any; // Firestore instance
}

// If you are using Firestore or other Firebase services
declare module 'firebase/firestore' {
    import { Firestore } from 'firebase/firestore';
    export const firestore: Firestore;
    export * from '@firebase/firestore';

}

// Declare additional Firebase modules as needed