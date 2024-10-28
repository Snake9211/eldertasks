import * as admin from "firebase-admin";
// index.ts
import * as functions from "firebase-functions";

import cors from "cors";

admin.initializeApp();

const corsHandler = cors({origin: true});

// Add Task Function using onRequest
export const addTask = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== "POST") {
      response.status(405).send({error: "Method Not Allowed"});
      return;
    }

    // Authentication Check
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).send({error: "Unauthorized"});
      return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    let uid: string;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      uid = decodedToken.uid;
    } catch (error) {
      response.status(401).send({error: "Invalid token"});
      return;
    }

    const {name, description, familyId, status} = request.body;

    // Input Validation
    if (!name || !description || !familyId) {
      response.status(400).send({
        error: "Task name, description, and familyId are required.",
      });
      return;
    }

    // Status Validation
    const validStatuses = ["Pending", "In Progress", "Completed"];
    const taskStatus =
      typeof status === "string" && validStatuses.includes(status) ?
        status :
        "Pending";

    // Generate Task ID and Timestamp
    const taskId = `task_${Date.now()}`;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    try {
      // Add Task to Firestore
      await admin.firestore().collection("Tasks").doc(taskId).set({
        name,
        description,
        family_id: familyId,
        status: taskStatus,
        createdAt: timestamp,
        createdBy: uid,
      });

      functions.logger.info("Task added successfully with ID:", taskId);
      response.status(200).send({id: taskId});
    } catch (error) {
      functions.logger.error("Failed to add task:", error);
      response.status(500).send({error: "Failed to add task."});
    }
  });
});

// GetTasksData Interface
interface GetTasksData {
  familyId: string;
}

// Get Tasks Function
export const getTasks = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== "GET") {
      response.status(405).send({error: "Method Not Allowed"});
      return;
    }

    // Authentication Check
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      response.status(401).send({error: "Unauthorized"});
      return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    let uid: string;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      uid = decodedToken.uid;
    } catch (error) {
      response.status(401).send({error: "Invalid token"});
      return;
    }

    // Extract familyId from query parameters
    const familyId = request.query.familyId as string;

    // Input Validation
    if (!familyId) {
      response.status(400).send({
        error: "Family ID is required.",
      });
      return;
    }

    try {
      // Retrieve Tasks from Firestore
      const tasksSnapshot = await admin
        .firestore()
        .collection("Tasks")
        .where("family_id", "==", familyId)
        .get();

      const tasks = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      response.status(200).send({tasks});
    } catch (error) {
      functions.logger.error("Failed to get tasks:", error);
      response.status(500).send({error: "Failed to get tasks."});
    }
  });
});

// UpdateTaskData Interface
interface UpdateTaskData {
  taskId: string;
  updates: {
    name?: string;
    description?: string;
    status?: string;
  };
}

// Update Task Function
export const updateTask = functions.https.onCall(
  async (
    request: functions.https.CallableRequest<UpdateTaskData>
  ): Promise<void> => {
    const data = request.data;
    const context = request;
    // Authentication Check
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be logged in to update a task."
      );
    }

    const {taskId, updates} = data;

    // Input Validation
    if (!taskId || !updates) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Task ID and updates are required."
      );
    }

    // Status Validation if Provided
    if (updates.status) {
      const validStatuses = ["Pending", "In Progress", "Completed"];
      if (!validStatuses.includes(updates.status)) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Invalid status value."
        );
      }
    }

    try {
      // Update Task in Firestore
      await admin.firestore().collection("Tasks").doc(taskId).update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info("Task updated successfully:", taskId);
    } catch (error) {
      functions.logger.error("Failed to update task:", error);
      throw new functions.https.HttpsError("unknown", "Failed to update task.");
    }
  }
);

// DeleteTaskData Interface
interface DeleteTaskData {
  taskId: string;
}

// Delete Task Function
export const deleteTask = functions.https.onCall(
  async (
    request: functions.https.CallableRequest<DeleteTaskData>
  ): Promise<void> => {
    const data = request.data;
    const context = request;
    // Authentication Check
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be logged in to delete a task."
      );
    }

    const {taskId} = data;

    // Input Validation
    if (!taskId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Task ID is required."
      );
    }

    try {
      // Delete Task from Firestore
      await admin.firestore().collection("Tasks").doc(taskId).delete();

      functions.logger.info("Task deleted successfully:", taskId);
    } catch (error) {
      functions.logger.error("Failed to delete task:", error);
      throw new functions.https.HttpsError("unknown", "Failed to delete task.");
    }
  }
);
