"use client"
import { useState, useEffect, useCallback, useRef } from "react"

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

const DEFAULT_TIMES: Record<TimerMode, number> = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
}

export function usePomodoro() {
    const [mode, setMode] = useState<TimerMode>("pomodoro")
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.pomodoro)
    const [isActive, setIsActive] = useState(false)
    
    const [settings, setSettings] = useState<Record<TimerMode, number>>(DEFAULT_TIMES)
    
    const [autoFlow, setAutoFlow] = useState(false)
    const [targetSessions, setTargetSessions] = useState(3)
    const [completedSessions, setCompletedSessions] = useState(0)

    const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for notification sound

    useEffect(() => {
        audioRef.current = new Audio('/audio.mp3');
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playNotification = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Audio playback failed", e));
            
            // Auto-stop after 1.3 seconds to avoid long audio files playing fully
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }, 1300);
        }
    }, []);

    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode)
        setTimeLeft(settings[newMode])
        setIsActive(false)
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [settings])

    const setCustomTime = useCallback((minutes: number, forMode: TimerMode = mode) => {
        const seconds = Math.max(0, minutes * 60)
        setSettings(prev => ({ ...prev, [forMode]: seconds }))
        
        if (forMode === mode) {
            setTimeLeft(seconds)
            setIsActive(false)
        }
    }, [mode])

    const handleSessionComplete = useCallback(() => {
        playNotification();

        if (mode === "pomodoro") {
            const nextCount = completedSessions + 1
            setCompletedSessions(nextCount)
            
            const nextMode = nextCount >= targetSessions ? "longBreak" : "shortBreak"
            setMode(nextMode)
            setTimeLeft(settings[nextMode])
            
            if (nextCount >= targetSessions) setCompletedSessions(0)
            
            if (autoFlow) {
                setIsActive(true)
            } else {
                setIsActive(false)
            }
        } else {
            setMode("pomodoro")
            setTimeLeft(settings.pomodoro)
            
            if (autoFlow) {
                setIsActive(true)
            } else {
                setIsActive(false)
            }
        }
    }, [mode, completedSessions, autoFlow, targetSessions, settings, playNotification])

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null // Timer countdown logic

        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleSessionComplete()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, handleSessionComplete])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const progress = (timeLeft / settings[mode]) * 100

    return {
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
    }
}
