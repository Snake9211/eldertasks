import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";

import { Family, SuggestedTask, Task, User } from '../types';
import { Request, Response } from 'express'; // Import Request and Response
import { collection, getDocs, query, where } from 'firebase/firestore';

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore(); // Use the Firestore instance from admin

// Fetching family tasks
export const fetchFamilyTasks = async (req: Request, res: Response) => {
    const familyId = req.query.familyId as string; // Cast to string
    if (!familyId) {
        res.status(400).send('Missing familyId');
        return;
    }

    // Use Admin SDK's Firestore methods
    const tasksRef = db.collection('Tasks'); // Get the collection reference
    const q = tasksRef.where('family_id', '==', familyId); // Create the query

    try {
        const querySnapshot = await q.get(); // Execute the query
        const tasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(tasks); // Return the tasks
    } catch (error) {
        logger.error('Error fetching family tasks:', error);
        res.status(500).send('Error fetching tasks');
    }
};

// Adding a new task
export const addTask = functions.https.onRequest(async (req: Request, res: Response) => {
    const { family_id, name, description } = req.body;

    if (!family_id || !name || !description) {
        res.status(400).send('Missing required fields');
        return;
    }

    try {
        const newTask = await db.collection('Tasks').add({
            family_id,
            name,
            description,
            status: 'pending',
        });
        res.status(201).json({ id: newTask.id });
    } catch (error) {
        logger.error('Error adding task:', error);
        res.status(500).send('Error adding task');
    }
});

// Updating a task's status
export const updateTaskStatus = functions.https.onRequest(async (req: Request, res: Response) => {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
        res.status(400).send('Missing required fields');
        return;
    }

    try {
        await db.collection('Tasks').doc(taskId).update({ status });
        res.status(200).send('Task updated successfully');
    } catch (error) {
        logger.error('Error updating task:', error);
        res.status(500).send('Error updating task');
    }
});

// Fetching suggested tasks
export const getSuggestedTasks = functions.https.onRequest(async (req: Request, res: Response) => {
    try {
        const suggestedTasksSnapshot = await db.collection('SuggestedTasks').get();
        const suggestedTasks = suggestedTasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(suggestedTasks);
    } catch (error) {
        logger.error('Error fetching suggested tasks:', error);
        res.status(500).send('Error fetching suggested tasks');
    }
});