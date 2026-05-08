"use client"
import { useState } from "react"
import { useTasks } from "../hooks/useTasks"

export default function Todolist() {
    const { 
        tasks, 
        addTask, 
        toggleTask, 
        deleteTask, 
        updateTaskText, 
        addUnderTask, 
        toggleUnderTask 
    } = useTasks();
    
    const [newTask, setNewTask] = useState("");
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

    const handleAddTask = () => {
        if (newTask.trim() !== "") {
            addTask(newTask);
            setNewTask("");
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto py-12 px-4 antialiased">
            <header className="mb-12 text-center sm:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
                    Focus
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                    Organisez vos pensées, une étape à la fois.
                </p>
            </header>
            
            <div className="relative mb-10 group">
                <input 
                    type="text" 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                    placeholder="Qu'allez-vous accomplir ?" 
                    className="w-full pl-0 pr-12 py-3 bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 outline-none transition-all text-xl font-light placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                />
                <button 
                    onClick={handleAddTask}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
            <div className="space-y-6">
                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-300 dark:text-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        <p className="font-medium tracking-wide">L'esprit est libre. Ajoutez une tâche.</p>
                    </div>
                )}         
                <ul className="space-y-4">
                    {tasks.map((task) => (
                        <li key={task.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all shadow-sm hover:shadow-md">
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    className={`mt-1.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        task.completed 
                                        ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100" 
                                        : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100"
                                    }`}
                                >
                                    {task.completed && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white dark:text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    )}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                    {editingTaskId === task.id ? (
                                        <input 
                                            autoFocus
                                            type="text" 
                                            value={task.text} 
                                            onChange={(e) => updateTaskText(task.id, e.target.value)}
                                            onBlur={() => setEditingTaskId(null)}
                                            onKeyDown={(e) => e.key === "Enter" && setEditingTaskId(null)}
                                            className="w-full bg-transparent outline-none text-zinc-900 dark:text-zinc-100 font-medium text-lg"
                                        />
                                    ) : (
                                        <h3 
                                            onClick={() => setEditingTaskId(task.id)}
                                            className={`text-lg font-medium cursor-text truncate transition-all ${
                                                task.completed ? "text-zinc-400 line-through decoration-zinc-400" : "text-zinc-900 dark:text-zinc-100"
                                            }`}
                                        >
                                            {task.text}
                                        </h3>
                                    )}

                                    <div className="mt-4 space-y-3">
                                        {task.underTask.map((ut) => (
                                            <div key={ut.id} className="flex items-center gap-3 group/step">
                                                <button 
                                                    onClick={() => toggleUnderTask(task.id, ut.id)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                                        ut.completed 
                                                        ? "bg-zinc-400 border-zinc-400 dark:bg-zinc-600 dark:border-zinc-600" 
                                                        : "border-zinc-300 dark:border-zinc-700"
                                                    }`}
                                                >
                                                    {ut.completed && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                </button>
                                                <span className={`text-sm transition-all ${ut.completed ? "text-zinc-400 line-through" : "text-zinc-600 dark:text-zinc-400"}`}>
                                                    {ut.text}
                                                </span>
                                            </div>
                                        ))}
                                        
                                        <div className="flex items-center gap-2 group/input">
                                            <div className="w-4 h-4 rounded border-dashed border border-zinc-300 dark:border-zinc-700 flex-shrink-0"></div>
                                            <input 
                                                type="text" 
                                                placeholder="Ajouter une étape..." 
                                                className="bg-transparent border-none p-0 text-sm outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-800 text-zinc-500 w-full focus:placeholder:text-zinc-400 transition-all"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        addUnderTask(task.id, e.currentTarget.value);
                                                        e.currentTarget.value = "";
                                                    }
                                                }} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 dark:hover:text-red-400 transition-all"
                                    aria-label="Supprimer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
