import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../services/socket";

export default function Sidebar({
  currentRoom,
  setCurrentRoom,
  selectedUser,
  setSelectedUser,
}) {
  const [users, setUsers] = useState([]);

  const rooms = [
    {
      id: "general",
      name: "General Chat",
      icon: "💬",
    },
    {
      id: "development",
      name: "Development",
      icon: "💻",
    },
    {
      id: "design",
      name: "Design",
      icon: "🎨",
    },
    {
      id: "random",
      name: "Random",
      icon: "🎲",
    },
  ];

  // Load users initially
  useEffect(() => {
    loadUsers();
  }, []);

  // User online/offline updates
  useEffect(() => {
    socket.on("userStatusChanged", ({ userId, status }) => {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                status,
              }
            : user
        )
      );
    });

    return () => {
      socket.off("userStatusChanged");
    };
  }, []);

  // New user registration updates
  useEffect(() => {
    socket.on("userCreated", () => {
      loadUsers();
    });

    return () => {
      socket.off("userCreated");
    };
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");

      console.log("Users:", res.data);

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-72 border-r bg-white dark:bg-zinc-900 flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b dark:border-zinc-800">
        <input
          type="text"
          placeholder="Search users or rooms..."
          className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 rounded-2xl focus:outline-none"
        />
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Rooms */}
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

        {/* Direct Messages */}
        <h3 className="text-xs font-semibold text-gray-500 mb-3">
          DIRECT MESSAGES
        </h3>

        <div className="space-y-1">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer ${
                selectedUser?._id === u._id
                  ? "bg-violet-100 text-violet-700"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    u.status === "online"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />

                <span>{u.name}</span>
              </div>

              <span
                className={`text-xs font-medium ${
                  u.status === "online"
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {u.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}