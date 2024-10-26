// AddTaskForm.tsx
import React, { useState } from 'react';

const AddTaskForm: React.FC = () => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState('Pending');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your logic to save the task to the database here

        // Reset the form
        setTaskName('');
        setTaskDescription('');
        setTaskStatus('Pending');

        alert('Task added successfully!');
    };

    return (
        <div className="container">
            <h1>Add New Task</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="taskName" className="form-label">Task Name</label>
                    <input
                        type="text"
                        id="taskName"
                        className="form-control"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="taskDescription" className="form-label">Description</label>
                    <textarea
                        id="taskDescription"
                        className="form-control"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="taskStatus" className="form-label">Status</label>
                    <select
                        id="taskStatus"
                        className="form-select"
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-success">Add Task</button>
            </form>
        </div>
    );
};

export default AddTaskForm;