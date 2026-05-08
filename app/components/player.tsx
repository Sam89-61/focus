"use client"
import { useState, useMemo, useEffect, useRef } from "react"
import { usePlayer } from "../hooks/usePlayer"

export default function Player() {
    const {
        tracks,
        currentTrack,
        isPlaying,
        volume,
        updateVolume,
        addTrack,
        removeTrack,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        currentTrackIndex
    } = usePlayer()

    const [newUrl, setNewUrl] = useState("")
    const [newName, setNewName] = useState("")
    const [showAdd, setShowAdd] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handleAdd = () => {
        if (newUrl.trim() && newName.trim()) {
            addTrack(newUrl, newName)
            setNewUrl("")
            setNewName("")
            setShowAdd(false)
        }
    }

    // Sync HTML5 audio volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const youtubeId = useMemo(() => {
        if (!currentTrack || currentTrack.type !== "youtube") return null
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = currentTrack.url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }, [currentTrack])

    return (
        <div className="w-full max-w-md mx-auto mt-8 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm antialiased">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Ambiance</h2>
                <div className="flex items-center gap-2">
                    {/* Volume Slider */}
                    <div className="flex items-center gap-2 mr-2 group/vol">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover/vol:text-zinc-600 dark:group-hover/vol:text-zinc-200 transition-colors"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.08"></path></svg>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume}
                            onChange={(e) => updateVolume(parseFloat(e.target.value))}
                            className="w-16 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
                        />
                    </div>
                    <button 
                        onClick={() => setShowAdd(!showAdd)}
                        className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </div>
            </header>

            {showAdd && (
                <div className="mb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <input 
                        type="text" 
                        placeholder="Nom de la piste" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm"
                    />
                    <input 
                        type="text" 
                        placeholder="URL YouTube ou MP3" 
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm"
                    />
                    <button 
                        onClick={handleAdd}
                        className="w-full py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-xl text-sm font-bold"
                    >
                        Ajouter à la playlist
                    </button>
                </div>
            )}

            {/* Hidden Player logic */}
            {isPlaying && currentTrack && (
                <div className="hidden">
                    {currentTrack.type === "youtube" && youtubeId ? (
                        <iframe 
                            width="0" height="0" 
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&volume=${Math.round(volume * 100)}`}
                            allow="autoplay"
                        ></iframe>
                    ) : (
                        <audio ref={audioRef} autoPlay src={currentTrack.url} onEnded={nextTrack}></audio>
                    )}
                </div>
            )}

            {/* UI Player Controls */}
            <div className="flex flex-col items-center gap-4">
                <div className="text-center w-full">
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100 truncate px-4">
                        {currentTrack?.name || "Aucune piste"}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">
                        {currentTrack?.type || "Playlist vide"}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={prevTrack} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                    </button>
                    
                    <button 
                        onClick={togglePlay}
                        className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        )}
                    </button>

                    <button onClick={nextTrack} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                    </button>
                </div>
            </div>

            {/* Playlist Scroll */}
            {tracks.length > 0 && (
                <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {tracks.map((track, index) => (
                            <li 
                                key={track.id}
                                className={`flex justify-between items-center p-3 rounded-xl transition-all group ${
                                    currentTrackIndex === index 
                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" 
                                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500"
                                }`}
                            >
                                <button 
                                    onClick={() => playTrack(index)}
                                    className="flex-1 text-left text-sm font-medium truncate"
                                >
                                    {track.name}
                                </button>
                                <button 
                                    onClick={() => removeTrack(track.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-300 hover:text-red-500 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
