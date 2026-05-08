"use client"
import { useState, useEffect, useCallback } from "react"

export type MediaType = "youtube" | "mp3"

export interface Track {
    id: string;
    name: string;
    url: string;
    type: MediaType;
}

export function usePlayer() {
    const [tracks, setTracks] = useState<Track[]>([])
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const savedTracks = localStorage.getItem("player_tracks")
        if (savedTracks) {
            try {
                setTracks(JSON.parse(savedTracks))
            } catch (e) {
                console.error("Failed to parse tracks", e)
            }
        }
    }, [])

    const saveTracks = (newTracks: Track[]) => {
        setTracks(newTracks)
        localStorage.setItem("player_tracks", JSON.stringify(newTracks))
    }

    const addTrack = (url: string, name: string) => {
        let type: MediaType = "mp3"
        let id = Date.now().toString()

        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            type = "youtube"
        }

        const newTrack: Track = { id, name, url, type }
        const updated = [...tracks, newTrack]
        saveTracks(updated)
        if (currentTrackIndex === null) setCurrentTrackIndex(0)
    }

    const removeTrack = (id: string) => {
        const updated = tracks.filter(t => t.id !== id)
        saveTracks(updated)
        if (updated.length === 0) {
            setCurrentTrackIndex(null)
            setIsPlaying(false)
        }
    }

    const playTrack = (index: number) => {
        setCurrentTrackIndex(index)
        setIsPlaying(true)
    }

    const togglePlay = () => setIsPlaying(!isPlaying)

    const nextTrack = () => {
        if (currentTrackIndex !== null && tracks.length > 0) {
            setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length)
        }
    }

    const prevTrack = () => {
        if (currentTrackIndex !== null && tracks.length > 0) {
            setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length)
        }
    }

    return {
        tracks,
        currentTrack: currentTrackIndex !== null ? tracks[currentTrackIndex] : null,
        isPlaying,
        addTrack,
        removeTrack,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        currentTrackIndex
    }
}
