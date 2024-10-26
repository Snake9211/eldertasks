import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';

import { db } from '../firebase'; // Update the path as needed

interface AddTaskProps {
  onTaskAdded: (taskName: string) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded }) => {
  const [taskName, setTaskName] = useState('');
  const [error, setError] = useState('');

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
    setError(''); // Clear any previous errors
  };

  const handleNextClick = async () => {
    if (taskName.trim() === '') {
      setError('Please enter a task name.');
      return;
    }

    try {
      // Save the task to Firestore
      await addDoc(collection(db, 'tasks'), { name: taskName });

      // Call the onTaskAdded function to update the tasks in the menu
      onTaskAdded(taskName);

      // Clear the input field after submission
      setTaskName('');
    } catch (error) {
      console.error("Error adding task to Firestore: ", error);
      setError("Failed to add task. Please try again.");
    }
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '10px' }}>Add a new task</Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Give your task a clear, descriptive title.
      </Typography>
      <TextField
        label="Example: Hang new mirror in guest room"
        fullWidth
        variant="outlined"
        value={taskName}
        onChange={handleTaskNameChange}
        error={!!error}
        helperText={error}
        style={{ margin: '10px 0' }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleNextClick}
        style={{ marginTop: '20px' }}
      >
        Next
      </Button>
    </Box>
  );
};

export default AddTask;