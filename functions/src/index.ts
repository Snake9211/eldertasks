import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";

import { collection, getDocs, query, where } from 'firebase/firestore';

// Fetching family tasks
// src/services/taskService.ts
import { db } from './firebase';

// Initialize Firebase Admin SDK
admin.initializeApp();


export const fetchFamilyTasks = functions.https.onCall(async (data, context) => {
    // Check for authenticated user
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to fetch tasks.');
    }

    const { familyId } = data;
    if (!familyId) {
        throw new functions.https.HttpsError('invalid-argument', 'Family ID is required');
    }

    try {
        const tasksSnapshot = await admin.firestore().collection('Tasks')
            .where('family_id', '==', familyId).get();

        const tasks = tasksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { tasks };
    } catch (error) {
        throw new functions.https.HttpsError('unknown', 'Failed to fetch tasks', error);
    }
});

// Adding a new task
export const addTask = functions.https.onRequest(async (req, res) => {
    const { family_id, name, description } = req.body;

    if (!family_id || !name || !description) {
        res.status(400).send('Missing required fields');
        return;
    }

    try {
        const newTask = await admin.firestore().collection('Tasks').add({
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
export const updateTaskStatus = functions.https.onRequest(async (req, res) => {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
        res.status(400).send('Missing required fields');
        return;
    }

    try {
        await admin.firestore().collection('Tasks').doc(taskId).update({ status });
        res.status(200).send('Task updated successfully');
    } catch (error) {
        logger.error('Error updating task:', error);
        res.status(500).send('Error updating task');
    }
});

// Fetching suggested tasks
export const getSuggestedTasks = functions.https.onRequest(async (req, res) => {
    try {
        const suggestedTasksSnapshot = await admin.firestore().collection('SuggestedTasks').get();
        const suggestedTasks = suggestedTasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(suggestedTasks);
    } catch (error) {
        logger.error('Error fetching suggested tasks:', error);
        res.status(500).send('Error fetching suggested tasks');
    }
});