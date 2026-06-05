import { useEffect, useState } from "react";
import api from "../services/api";

export default function Sidebar({
  currentRoom,
  setCurrentRoom,
  selectedUser,
  setSelectedUser,
}) {
  const [users, setUsers] = useState([]);

  const rooms = [
    { id: "general", name: "General Chat", icon: "💬" },
    { id: "development", name: "Development", icon: "💻" },
    { id: "design", name: "Design", icon: "🎨" },
    { id: "random", name: "Random", icon: "🎲" },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

        <h3 className="text-xs font-semibold text-gray-500 mb-3">
          ROOMS
        </h3>

        <div className="space-y-1">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => {
                setCurrentRoom(room.id);
                setSelectedUser(null);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer ${
                currentRoom === room.id && !selectedUser
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span>{room.icon}</span>
              <span>{room.name}</span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <h3 className="text-xs font-semibold text-gray-500 mb-3">
          DIRECT MESSAGES
        </h3>

        <div className="space-y-1">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer ${
                selectedUser?._id === u._id
                  ? "bg-violet-100 text-violet-700"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              👤 {u.name}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}