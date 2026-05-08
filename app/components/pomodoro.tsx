"use client"
import { useState } from "react"
import { usePomodoro, TimerMode } from "../hooks/usePomodoro"

export default function Pomodoro() {
    const {
        mode,
        timeLeft,
        isActive,
        setIsActive,
        switchMode,
        setCustomTime,
        formatTime,
        progress,
        autoFlow,
        setAutoFlow,
        targetSessions,
        setTargetSessions,
        completedSessions,
        settings
    } = usePomodoro()

    const [editingMode, setEditingMode] = useState<TimerMode | null>(null)
    const [editValue, setEditValue] = useState("")

    const handleEditSubmit = () => {
        if (editingMode) {
            const mins = parseInt(editValue)
            if (!isNaN(mins) && mins > 0 && mins <= 999) {
                setCustomTime(mins, editingMode)
            }
        }
        setEditingMode(null)
        setEditValue("")
    }

    return (
        <div className="w-full max-w-md mx-auto mb-16 p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-4 right-6 flex gap-1">
                {[...Array(targetSessions)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i < completedSessions
                                ? "bg-zinc-900 dark:bg-zinc-100"
                                : "bg-zinc-200 dark:bg-zinc-800"
                            }`}
                    />
                ))}
            </div>
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-full">
                    {(Object.keys(settings) as TimerMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all flex-1 ${mode === m
                                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                }`}
                        >
                            {m === "pomodoro" ? "Focus" : m === "shortBreak" ? "Repos" : "Pause"}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between px-2 text-[10px] font-mono text-zinc-400">
                    {(Object.keys(settings) as TimerMode[]).map((m) => (
                        <div key={m} className="flex flex-col items-center gap-1 group/mode">
                            <span className={mode === m ? "text-zinc-900 dark:text-zinc-100 font-bold" : ""}>
                                {m === "pomodoro" ? "F" : m === "shortBreak" ? "R" : "P"}
                            </span>
                            {editingMode === m ? (
                                <input
                                    autoFocus
                                    className="w-8 bg-zinc-200 dark:bg-zinc-700 rounded text-center outline-none text-zinc-900 dark:text-zinc-100"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value.replace(/\D/g, ''))}
                                    onBlur={handleEditSubmit}
                                    onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
                                />
                            ) : (
                                <button
                                    onClick={() => {
                                        setEditingMode(m)
                                        setEditValue((settings[m] / 60).toString())
                                    }}
                                    className={`hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${mode === m ? "text-zinc-600 dark:text-zinc-300 underline underline-offset-4 decoration-zinc-300" : ""}`}
                                >
                                    {settings[m] / 60}m
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative inline-flex items-center justify-center mb-8">
                <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-zinc-200 dark:text-zinc-800"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray={553}
                        strokeDashoffset={553 - (553 * progress) / 100}
                        strokeLinecap="round"
                        className="text-zinc-900 dark:text-zinc-100 transition-all duration-1000 ease-linear"
                    />
                </svg>

                <div className="absolute flex flex-col items-center">
                    <div className="text-5xl font-light tracking-tighter text-zinc-900 dark:text-zinc-100 font-mono">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 items-center">
                <div className="flex items-center gap-8 px-4 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-semibold text-zinc-400 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span>Auto</span>
                        <button
                            onClick={() => setAutoFlow(!autoFlow)}
                            className={`w-8 h-4 rounded-full relative transition-all ${autoFlow ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-800"}`}
                        >
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${autoFlow ? "right-0.5 bg-white dark:bg-black" : "left-0.5 bg-zinc-400"}`} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 border-l border-zinc-100 dark:border-zinc-800 pl-8">
                        <span>Série</span>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={targetSessions}
                            onChange={(e) => setTargetSessions(parseInt(e.target.value) || 1)}
                            className="w-8 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none text-center font-bold"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`px-10 py-3 rounded-2xl font-bold tracking-tight transition-all ${isActive
                                ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black hover:scale-105 active:scale-95"
                            }`}
                    >
                        {isActive ? "PAUSE" : "DÉMARRER"}
                    </button>

                    <button
                        onClick={() => switchMode(mode)}
                        className="p-3 rounded-2xl text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
                        aria-label="Reset"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
