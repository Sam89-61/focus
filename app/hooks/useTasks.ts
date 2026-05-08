"use client"
import { useState, useEffect } from "react"
import { Task } from "../types/tasK"

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        const b = async () => {
            const storageTasks = localStorage.getItem("tasks")
            if (storageTasks) {
                try {
                    setTasks(JSON.parse(storageTasks))
                } catch (e) {
                    console.error("Failed to parse tasks from localStorage", e)
                }
            }
        }
        b();
    }, [])

    const saveTasks = (updatedTasks: Task[]) => {
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    const addTask = (text: string) => {
        if (text.trim() !== "") {
            const itemTask: Task = {
                id: Date.now(),
                text: text,
                underTask: [],
                completed: false
            }
            saveTasks([...tasks, itemTask]);
        }
    }

    const toggleTask = (taskId: number) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        saveTasks(updatedTasks);
    }

    const deleteTask = (taskId: number) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        saveTasks(updatedTasks);
    }

    const updateTaskText = (taskId: number, newText: string) => {
        const updatedTasks = tasks.map((task) =>
            task.id === taskId ? { ...task, text: newText } : task
        );
        saveTasks(updatedTasks);
    }

    const addUnderTask = (taskId: number, text: string) => {
        if (text.trim() === "") return;
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return {
                    ...task,
                    underTask: [...task.underTask, { id: Date.now(), text: text, completed: false }]
                }
            }
            return task;
        });
        saveTasks(updatedTasks);
    }

    const toggleUnderTask = (taskId: number, underTaskId: number) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    underTask: task.underTask.map(ut =>
                        ut.id === underTaskId ? { ...ut, completed: !ut.completed } : ut
                    )
                }
            }
            return task;
        });
        saveTasks(updatedTasks);
    }

    return {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTaskText,
        addUnderTask,
        toggleUnderTask
    }
}
