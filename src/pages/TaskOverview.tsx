import { Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '../firebase'; // Adjust the path as needed

const TaskOverview: React.FC<{ familyId: string }> = ({ familyId }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksRef = collection(db, 'Tasks');
        const q = query(tasksRef, where('family_id', '==', familyId)); // Fetch tasks for specific family
        const querySnapshot = await getDocs(q);

        const fetchedTasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [familyId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4">Upcoming Tasks</Typography>
      {tasks.length === 0 ? (
        <Typography>No upcoming tasks found.</Typography>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f7f7f7' }}>
            <CardContent>
              <Typography variant="h5">{task.name}</Typography>
              <Typography>Opt in before {task.dueDate || 'N/A'}</Typography>
              <Typography>Additional fee of ${task.fee || 'N/A'}</Typography>
              <Button variant="outlined" color="primary" fullWidth style={{ marginTop: '10px' }}>
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default TaskOverview;