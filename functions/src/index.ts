/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as logger from "firebase-functions/logger";

import {onRequest} from "firebase-functions/v2/https";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// Initialize Firebase Admin SDK
admin.initializeApp();

// Fetching family tasks
export const getFamilyTasks = functions.https.onRequest(async (req, res) => {
    const { familyId } = req.query; // Get familyId from query parameters
    try {
        const tasksSnapshot = await admin.firestore().collection('Tasks')
            .where('family_id', '==', familyId)
            .get();

        const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(tasks);
    } catch (error) {
        logger.error('Error fetching tasks:', error);
        res.status(500).send('Error fetching tasks');
    }
});

// Adding a new task
export const addTask = functions.https.onRequest(async (req, res) => {
    const { family_id, name, description } = req.body;
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
    try {
        await admin.firestore().collection('Tasks').doc(taskId).update({ status });
        res.status(200).send('Task updated successfully');
    } catch (error) {
        logger.error('Error updating task:', error);
        res.status(500).send('Error updating task');
    }
});

// Fetching sample suggested tasks
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