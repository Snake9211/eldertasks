import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Assignment, CheckCircle, Delete, EventNote } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { SuggestedTask, Task } from '../types';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { db } from '../firebase'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const TaskOverview: React.FC<{ familyId: string }> = ({ familyId }) => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State for Confirmation Dialog (Adding Suggested Task)
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [selectedSuggestedTask, setSelectedSuggestedTask] = useState<SuggestedTask | null>(null);

  // State for Details Dialog (Viewing Task Details)
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);

  // State for Delete Confirmation Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // State for Mark Complete Confirmation Dialog
  const [openCompleteDialog, setOpenCompleteDialog] = useState<boolean>(false);
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!currentUser) {
          setLoading(false);
          return;
        }

        // Fetch Current Tasks
        const tasksRef = collection(db, 'Tasks');
        const q = query(
          tasksRef,
          where('familyId', '==', currentUser.familyId) // Fetch tasks for specific family
        );
        const querySnapshot = await getDocs(q);

        const fetchedTasks: Task[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Task, 'id'>), // Cast doc.data() to Task without id
        }));

        // Fetch Suggested Tasks
        const suggestedTasksRef = collection(db, 'SuggestedTasks');
        const suggestedTasksQuery = query(suggestedTasksRef);
        const suggestedTasksSnapshot = await getDocs(suggestedTasksQuery);
        const fetchedSuggestedTasks: SuggestedTask[] = suggestedTasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<SuggestedTask, 'id'>), // Cast doc.data() to SuggestedTask without id
        }));

        setTasks(fetchedTasks);
        setSuggestedTasks(fetchedSuggestedTasks);
        console.log('Fetched current tasks:', fetchedTasks);
        console.log('Fetched suggested tasks:', fetchedSuggestedTasks);
      } catch (error) {
        console.error('Error fetching tasks: ', error);
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [familyId, currentUser]);

  // Function to handle viewing task details
  const handleViewDetails = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTaskDetails(task);
      setOpenDetailsDialog(true);
    }
  };

  // Function to open the confirmation dialog for adding a suggested task
  const handleOpenConfirmDialog = (task: SuggestedTask) => {
    setSelectedSuggestedTask(task);
    setOpenConfirmDialog(true);
  };

  // Function to close the confirmation dialog
  const handleCloseConfirmDialog = () => {
    setSelectedSuggestedTask(null);
    setOpenConfirmDialog(false);
  };

  // Function to handle adding a suggested task to current tasks
  const handleAddSuggestedTask = async (task: SuggestedTask) => {
    try {
      // Validate Task Name
      if (!task.name) {
        setError('Task name is required.');
        return;
      }

      // Create a new task under the user's family
      const newTask: Omit<Task, 'id'> = {
        name: task.name,
        ...(task.dueDate ? { dueDate: task.dueDate } : {}),
        ...(typeof task.fee === 'number' ? { fee: task.fee } : {}),
        description: task.description || '',
        familyId: currentUser?.familyId as string, // Ensure familyId is a string
        isSuggested: false,
        status: 'Pending', // Set default status
        createdAt: new Date(), // Use Firestore Timestamp or serverTimestamp() if desired
      };

      const tasksRef = collection(db, 'Tasks');
      const docRef = await addDoc(tasksRef, newTask);

      // Update local state to reflect the new task
      setTasks((prev) => [...prev, { id: docRef.id, ...newTask }]);

      // Remove the task from suggestedTasks state
      setSuggestedTasks((prev) => prev.filter((t) => t.id !== task.id));

      console.log(`Task "${task.name}" has been added to your current tasks.`);
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error('Error adding suggested task:', error);
      setError('Failed to add suggested task.');
    } finally {
      handleCloseConfirmDialog();
    }
  };

  // Function to close the details dialog
  const handleCloseDetailsDialog = () => {
    setSelectedTaskDetails(null);
    setOpenDetailsDialog(false);
  };

  // Function to open delete confirmation dialog
  const handleOpenDeleteDialog = (task: Task) => {
    setTaskToDelete(task);
    setOpenDeleteDialog(true);
  };

  // Function to close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setTaskToDelete(null);
    setOpenDeleteDialog(false);
  };

  // Function to delete a task
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const taskDocRef = doc(db, 'Tasks', taskToDelete.id);
      await deleteDoc(taskDocRef);

      // Update local state
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));

      console.log(`Task "${taskToDelete.name}" has been deleted.`);
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task.');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Function to open mark as complete dialog
  const handleOpenCompleteDialog = (task: Task) => {
    setTaskToComplete(task);
    setOpenCompleteDialog(true);
  };

  // Function to close mark as complete dialog
  const handleCloseCompleteDialog = () => {
    setTaskToComplete(null);
    setOpenCompleteDialog(false);
  };

  // Function to mark a task as complete
  const handleMarkComplete = async () => {
    if (!taskToComplete) return;

    try {
      const taskDocRef = doc(db, 'Tasks', taskToComplete.id);
      await updateDoc(taskDocRef, { status: 'Completed' });

      // Update local state
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskToComplete.id ? { ...t, status: 'Completed' } : t
        )
      );

      console.log(`Task "${taskToComplete.name}" has been marked as completed.`);
      setError(null);
    } catch (error) {
      console.error('Error marking task as complete:', error);
      setError('Failed to mark task as complete.');
    } finally {
      handleCloseCompleteDialog();
    }
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

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
                  {/* Removed the description from the initial view */}
                  <Box display="flex" alignItems="center" mt={2}>
                    <EventNote sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body2">
                      Status: {task.status || 'Incomplete'}
                    </Typography>
                  </Box>
                  {task.fee !== undefined && (
                    <Typography variant="body2" mt={1}>
                      Additional fee: ${task.fee}
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleViewDetails(task.id)}
                  >
                    View Details
                  </Button>
                  {/* New Buttons for Delete and Mark Complete */}
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleOpenDeleteDialog(task)}
                    >
                      Delete
                    </Button>
                    {task.status !== 'Completed' && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleOpenCompleteDialog(task)}
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Suggested Tasks Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Suggested Tasks
        </Typography>

        {suggestedTasks.length === 0 ? (
          <Paper
            sx={{
              p: 3,
              backgroundColor: 'background.paper',
              color: 'text.secondary',
            }}
          >
            <Typography>No suggested tasks available.</Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {suggestedTasks.map((task) => (
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
                      <Assignment sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="h5">{task.name}</Typography>
                    </Box>
                    {/* Removed the description from the initial view */}
                    <Box display="flex" alignItems="center" mt={2}>
                      <EventNote sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="body2">
                        Suggested by: {task.dueDate || 'N/A'}
                      </Typography>
                    </Box>
                    {task.fee !== undefined && (
                      <Typography variant="body2" mt={1}>
                        Additional fee: ${task.fee}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleOpenConfirmDialog(task)}
                    >
                      Add to Current Tasks
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Confirmation Dialog for Adding Suggested Task */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-add-task-title"
        aria-describedby="confirm-add-task-description"
      >
        <DialogTitle id="confirm-add-task-title">Add Suggested Task</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-add-task-description">
            Are you sure you want to add "{selectedSuggestedTask?.name}" to your current tasks?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={() => selectedSuggestedTask && handleAddSuggestedTask(selectedSuggestedTask)}
            color="primary"
            autoFocus
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog for Viewing Task Details */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        aria-labelledby="task-details-title"
        aria-describedby="task-details-description"
      >
        <DialogTitle id="task-details-title">Task Details</DialogTitle>
        <DialogContent dividers>
          {selectedTaskDetails ? (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedTaskDetails.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Description:</strong> {selectedTaskDetails.description || 'No description provided.'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Due Date:</strong> {selectedTaskDetails.dueDate || 'N/A'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Additional Fee:</strong> {selectedTaskDetails.fee !== undefined ? `$${selectedTaskDetails.fee}` : 'N/A'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {selectedTaskDetails.status || 'Pending'}
              </Typography>
            </>
          ) : (
            <Typography variant="body2">No task selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to delete the task "{taskToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteTask} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mark as Complete Confirmation Dialog */}
      <Dialog
        open={openCompleteDialog}
        onClose={handleCloseCompleteDialog}
        aria-labelledby="confirm-complete-title"
        aria-describedby="confirm-complete-description"
      >
        <DialogTitle id="confirm-complete-title">Mark Task as Complete</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-complete-description">
            Are you sure you want to mark the task "{taskToComplete?.name}" as complete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompleteDialog}>Cancel</Button>
          <Button onClick={handleMarkComplete} color="success" autoFocus>
            Mark as Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskOverview;