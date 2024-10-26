import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import AddTask from '../pages/AddTask';
import { db } from '../firebase';

interface Task {
  id: string;
  name: string;
}

const TaskListView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const taskCollection = collection(db, 'tasks');
      const taskSnapshot = await getDocs(taskCollection);
      const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setTasks(taskList);
    };

    fetchTasks();
  }, []);

  const handleTaskAdded = (taskName: string) => {
    // Add the new task to the local state
    setTasks(prevTasks => [...prevTasks, { id: `${Date.now()}`, name: taskName }]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
      <AddTask onTaskAdded={handleTaskAdded} />
    </div>
  );
};

export default TaskListView;