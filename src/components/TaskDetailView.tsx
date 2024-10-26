// TaskDetailView.tsx
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import { Task } from '../types'; // Adjust based on your types
import { db } from '../firebase'; // Make sure this path is correct
import { useParams } from 'react-router-dom';

const TaskDetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) {
                setError("Task ID is required.");
                return;
            }

            try {
                const taskDoc = await getDoc(doc(db, 'Tasks', id)); // Ensure 'Tasks' matches your Firestore collection name
                if (taskDoc.exists()) {
                    setTask(taskDoc.data() as Task);
                } else {
                    setError("Task not found.");
                }
            } catch (err) {
                console.error("Error fetching task:", err);
                setError("Error fetching task: " + (err as Error).message);
            }
        };

        fetchTask();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{task.name}</h1>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
        </div>
    );
};

export default TaskDetailView;