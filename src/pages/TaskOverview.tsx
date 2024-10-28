import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Assignment, EventNote } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '../firebase'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface Task {
  id: string;
  name: string;
  dueDate?: string;
  fee?: number;
  description?: string;
}

const TaskOverview: React.FC<{ familyId: string }> = ({ familyId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useUser();


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!currentUser) {
          return;
        }
        const tasksRef = collection(db, 'Tasks');
        const q = query(tasksRef, where('familyId', '==', currentUser.familyId)); // Fetch tasks for specific family
        // const q = query(tasksRef); // Fetch tasks for specific family
        const querySnapshot = await getDocs(q);

        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];

        setTasks(fetchedTasks);
        console.log("got task, ", fetchedTasks)
      } catch (error) {
        console.error('Error fetching tasks: ', error);
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [familyId]);

  const handleViewDetails = (taskId: string) => {
    // Navigate to task details page (implement this route as needed)
    navigate(`/tasks/${taskId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '80vh',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          color: 'text.primary',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Tasks
      </Typography>

      {tasks.length === 0 ? (
        <Paper
          sx={{
            p: 3,
            backgroundColor: 'background.paper',
            color: 'text.secondary',
          }}
        >
          <Typography>No upcoming tasks found.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} key={task.id}>
              <Card
                sx={{
                  backgroundColor: 'background.paper',
                  color: 'text.primary',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Assignment sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h5">{task.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {task.description || 'No description available.'}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <EventNote sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body2">
                      Opt in before: {task.dueDate || 'N/A'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" mt={1}>
                    Additional fee: Our team will get back to you.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleViewDetails(task.id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TaskOverview;