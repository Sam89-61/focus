import Image from "next/image";
import Todolist from "./components/todolist";
import Pomodoro from "./components/pomodoro";
import Player from "./components/player";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-16 px-6 bg-white dark:bg-black sm:items-start transition-colors">
        <Pomodoro />
        <Todolist />
        <Player />
      </main>
    </div>
  );
}
