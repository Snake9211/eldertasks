import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';

import { SuggestedTask } from '../types';
import { db } from '../firebase';

const SuggestedTasksView: React.FC = () => {
    const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);

    useEffect(() => {
        const fetchSuggestedTasks = async () => {
            try {
                const tasksSnapshot = await getDocs(collection(db, 'suggestedTasks'));
                const tasks = tasksSnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id, // Ensure the document ID is included
                        name: data.name || 'Unnamed Task', // Default name if missing
                        description: data.description || 'No description provided', // Default if missing
                        status: data.status || 'Pending', // Default status if missing
                        estimated_cost: data.estimated_cost || 0, // Default cost if missing
                    } as SuggestedTask; // Type assertion to ensure it matches SuggestedTask
                });
                setSuggestedTasks(tasks);
            } catch (error) {
                console.error("Error fetching suggested tasks: ", error);
            }
        };
        fetchSuggestedTasks();
    }, []);

    const addSuggestedTask = async (task: SuggestedTask) => {
        try {
            const docRef = await addDoc(collection(db, 'suggestedTasks'), {
                name: task.name,
                description: task.description || 'Description not provided',
                status: 'Pending',
                estimated_cost: task.estimated_cost || 0,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding suggested task: ", error);
        }
    };

    return (
        <div>
            <h2>Suggested Tasks</h2>
            <ul>
                {suggestedTasks.map(task => (
                    <li key={task.id}>
                        {task.name} - <button onClick={() => addSuggestedTask(task)}>Add to List</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SuggestedTasksView;