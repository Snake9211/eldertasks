import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

interface AddTaskData {
  name: string;
  description: string;
  familyId: string;
  status?: string;
}

export const addTask = functions.https.onCall(
  async (request: functions.https.CallableRequest<AddTaskData>):
   Promise<{ id: string }> => {
    const data = request.data;
    const auth = request.auth;

    // Log the input data and auth context for debugging
    functions.logger.info("Function addTask called with data:", data);
    functions.logger.info("Authentication context:", auth);

    // Check for authenticated user
    if (!auth) {
      functions.logger.error("User not authenticated");
      throw new functions.https.HttpsError(
        "unauthenticated", "You must be logged in to add a task.");
    }

    const {name, description, familyId, status} = data;

    // Validate input
    if (!name || !description || !familyId) {
      functions.logger.error("Invalid arguments",
        {name, description, familyId});
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Task name,description, and familyId are required");
    }

    // Validate status or set default
    const validStatuses = ["Pending", "In Progress", "Completed"];
    let taskStatus: string;
    if (typeof status === "string" && validStatuses.includes(status)) {
      taskStatus = status;
    } else {
      taskStatus = "Pending";
    }

    // Generate a custom task ID and get the current timestamp
    const taskId = `task_${Date.now()}`;
    const unixTimestamp = Math.floor(Date.now() / 1000);

    try {
      // Add the task to the Firestore "Tasks" collection
      await admin.firestore().collection("Tasks").doc(taskId).set({
        name,
        description,
        family_id: familyId,
        status: taskStatus,
        createdAt: unixTimestamp,
        createdBy: auth.uid,
      });

      functions.logger.info("Task added successfully with ID:", taskId);
      return {id: taskId};
    } catch (error) {
      functions.logger.error("Failed to add task:", error);
      throw new functions.https.HttpsError("unknown", "Failed to add task");
    }
  }
);
