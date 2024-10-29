import { Add, Assignment, AssignmentTurnedIn, List } from '@mui/icons-material';
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
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { Task } from '../types';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const tasksRef = collection(db, 'Tasks');
        const q = query(
          tasksRef,
          where('familyId', '==', currentUser.familyId),
        );
        const querySnapshot = await getDocs(q);

        const fetchedTasks = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((task) => true) as Task[];

        // Sort tasks by creation time
        const sortedTasks = fetchedTasks.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        });

        setTasks(sortedTasks.slice(0, 5)); // Get the 5 most recent tasks
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load recent tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTasks();
  }, [currentUser]);

  const handleAddTask = () => {
    navigate('/add-task'); // Navigate to the task creation page
  };

  const handleViewAllTasks = () => {
    navigate('/tasks'); // Navigate to the tasks overview page
  };

  // Calculate Task Statistics
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;

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

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser?.displayName || 'User'}!
      </Typography>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              fullWidth
              onClick={handleAddTask}
            >
              Add New Task
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<List />}
              fullWidth
              onClick={handleViewAllTasks}
            >
              View All Tasks
            </Button>
          </Grid>
          {/* You can add more quick action buttons here */}
        </Grid>
      </Box>

      {/* Task Statistics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Task Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: 'success.light',
                color: 'success.contrastText',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AssignmentTurnedIn sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Completed</Typography>
                    <Typography variant="h4">{completedTasks}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: 'warning.light',
                color: 'warning.contrastText',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AssignmentTurnedIn sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Pending</Typography>
                    <Typography variant="h4">{pendingTasks}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Add more statistics cards as needed */}
        </Grid>
      </Box>

      {/* Recent Tasks */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Recent Tasks
        </Typography>
        {tasks.length === 0 ? (
          <Paper
            sx={{
              p: 2,
              backgroundColor: 'background.paper',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body1">
              You have no recent tasks. Start by adding a new task!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
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
                      <Typography variant="h6">{task.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Status: {task.status || 'Pending'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </Typography>                
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Home;