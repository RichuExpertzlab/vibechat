import { useState } from "react";

export default function Sidebar({ currentRoom, setCurrentRoom }) {
  const rooms = [
    { id: "general", name: "General Chat", icon: "💬" },
    { id: "development", name: "Development", icon: "💻" },
    { id: "design", name: "Design", icon: "🎨" },
    { id: "random", name: "Random", icon: "🎲" },
  ];

  return (
    <div className="w-72 border-r bg-white dark:bg-zinc-900 flex flex-col h-full">
      <div className="p-4 border-b dark:border-zinc-800">
        <input
          type="text"
          placeholder="Search users or rooms..."
          className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 rounded-2xl focus:outline-none"
        />
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2">ROOMS</h3>
        
        <div className="space-y-1">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setCurrentRoom(room.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${
                currentRoom === room.id 
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="text-xl">{room.icon}</span>
              <span className="font-medium">{room.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}