import { useState, useEffect } from 'react';
import moment from 'moment';

import { collatedTasksExist } from '../helpers';
import { firebase } from '../firebase';

// Runs as soon as you select a project and polls everytime to check for new tasks
export const useTasks = selectedProject => {
    const [tasks, setTasks] = useState([]);
    const [archivedTasks, setArchivedTaasks] = useState([]);

    useEffect(() => {
        let unsubscribe = firebase
            .firestore()
            .collection('tasks')
            .where('userId', '==', 'tYBkZdvw3oIknhLB8kmj');

        // Go through all tasks and check key which selected project
        // Just give me tasks for the selected Project 

        // we are passing in a selectedProject and if it doesnt exist in the collatedTasks (Inbox, today, next 7)
        // then fire through firebase where proejctId == selectedProject -> go get whatever projectId
        // If selectedProject == Today then get all tasks where date is today
        unsubscribe = selectedProject && !collatedTasksExist(selectedProject) ? 
        (unsubscribe = unsubscribe.where('projectId', '==', selectedProject)) 
        : selectedProject === 'TODAY'
        ? (unsubscribe = unsubscribe.where('date', '==', moment().format('DD/MM/YYYY')))
        : selectedProject === 'INBOX' || selectedProject === 0
        ? (unsubscribe = unsubscribe.where('date', '==', ''))
        : unsubscribe;

        unsubscribe = unsubscribe.onSnapshot(snapshot => {
            const newTasks = snapshot.docs.map(task => ({
                id: task.id,
                ...task.data(),
            }))
            
            setTasks(
                selectedProject === 'NEXT_7' 
                ? newTasks.filter(
                    task => 
                        moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7 &&
                        task.archived !== true
                )
                : newTasks.filter(task => task.archived !== true)
            );

            setArchivedTaasks(newTasks.filter(task => task.archived !== false))
        });

        // Should only run when selectedProject is changed
        return () => unsubscribe();
    }, [selectedProject]);

    return { tasks, archivedTasks };
};

// Get projects once as it wont be changing often
// When you add a project it will refetch the projects due to a change causing the useEffect to pop off and give a fresh snapshot
export const useProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        firebase
            .firestore()
            .collection('projects')
            .where('userId', '==', 'tYBkZdvw3oIknhLB8kmj')
            .orderBy('projectId')
            .get()
            .then(snapshot => {
                const allProjects = snapshot.docs.map(project => ({
                    ...project.data(),
                    docId: project.id,
                }));

                // To stop the useEffect from popping off everytime
                if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
                    setProjects(allProjects);
                }
        })
    }, [projects]);

    return { projects, setProjects }
}