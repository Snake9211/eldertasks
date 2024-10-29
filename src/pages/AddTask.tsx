import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { AssignmentTurnedIn } from "@mui/icons-material";
import { db } from "../firebase";
import { useUser } from "../context/UserContext";

type AddTaskProps = {
  onTaskAdded?: (taskName: string) => void;
};

const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded }) => {
  const { currentUser } = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddTask = async () => {
    setError(null);
    setSuccess(false);
  
    if (!name || !description || !currentUser?.familyId) {
      setError("Task name, description, and family ID are required.");
      return;
    }
  
    console.log("Attempting to add task:", {
      name,
      description,
      familyId: currentUser.familyId,
    });
  
    try {
      const tasksCollection = collection(db, 'Tasks');
      
      const newTask = {
        name: name,
        description: description,
        familyId: currentUser.familyId,
        status: 'Pending',
        createdAt: serverTimestamp() // Use Firebase server timestamp
      }
  
      const taskRef = await addDoc(tasksCollection, newTask);

      console.log("Task added successfully:", taskRef.id);
  
      setSuccess(true);
      setName("");
      setDescription("");
  
      if (onTaskAdded) {
        onTaskAdded(name);
      }
    } catch (error: any) {
      console.error("Error adding task:", error);
      setError(`Failed to add task: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          backgroundColor: "background.paper",
          color: "text.primary",
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <AssignmentTurnedIn sx={{ mr: 1, fontSize: 40, color: "primary.main" }} />
          <Typography variant="h4">Add a New Task</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Task added successfully!
          </Alert>
        )}

        <TextField
          label="Task Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputLabelProps={{
            sx: { color: "text.secondary" },
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputLabelProps={{
            sx: { color: "text.secondary" },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Paper>
    </Container>
  );
};

export default AddTask;