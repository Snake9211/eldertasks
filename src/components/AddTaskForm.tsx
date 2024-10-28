import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

import { useUser } from '../context/UserContext';

const AddTaskForm: React.FC = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      if (!currentUser) {
        setErrorMessage('You must be logged in to add a task.');
        return;
      }

      const familyId = currentUser.familyId;
      if (!familyId) {
        setErrorMessage('Unable to determine your family ID.');
        return;
      }

      const functions = getFunctions();
      const addTask = httpsCallable(functions, 'addTask');

      addTask({
        name: "Task Name",
        description: "Task Description",
        familyId: "family_id",
        status: "incomplete"
      })

      console.log('Task added successfully:');

      // Reset the form
      setTaskName('');
      setTaskDescription('');
      setTaskStatus('Pending');

      alert('Task added successfully!');
    } catch (error: any) {
      console.error('Error adding task:', error);
      setErrorMessage(error.message || 'Failed to add task. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Add New Task</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        {/* ... your form fields as before ... */}
      </form>
    </div>
  );
};

export default AddTaskForm;