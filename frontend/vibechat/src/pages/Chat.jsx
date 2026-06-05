import { useEffect, useState, useContext } from "react";
import socket from "../services/socket";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatWindow from "../components/ChatWindow";

import { AuthContext } from "../context/AuthContext";

export default function Chat() {

  const { user } = useContext(AuthContext);

  const [currentRoom, setCurrentRoom] =
    useState("general");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  // Register User
  useEffect(() => {

    if (user) {

      socket.emit(
        "registerUser",
        user.id
      );

    }

  }, [user]);

  // Room Messages
  useEffect(() => {

    if (!user || selectedUser) return;

    socket.emit(
      "joinRoom",
      currentRoom
    );

    loadRoomMessages();

  }, [currentRoom, user, selectedUser]);

  // Private Messages
  useEffect(() => {

    if (!selectedUser) return;

    loadPrivateMessages();

  }, [selectedUser]);

  // Receive Room Messages
  useEffect(() => {

    socket.on(
      "receiveMessage",
      (message) => {

        if (
          message.roomId === currentRoom
        ) {

          setMessages(prev => [
            ...prev,
            message
          ]);

        }

      }
    );

    return () => {

      socket.off(
        "receiveMessage"
      );

    };

  }, [currentRoom]);

  // Receive Private Messages
  useEffect(() => {

  socket.on(
  "receivePrivateMessage",
  (message) => {

    console.log("PRIVATE RECEIVED", message);

    setMessages(prev => [
      ...prev,
      message
    ]);

  }
);

    return () => {

      socket.off(
        "receivePrivateMessage"
      );

    };

  }, []);

  const loadRoomMessages =
    async () => {

      try {

        const res =
          await api.get(
            `/chat/${currentRoom}`
          );

        setMessages(
          res.data.messages || []
        );

      } catch (err) {

        console.error(err);

      }

    };

  const loadPrivateMessages =
    async () => {

      try {

        const res =
          await api.get(
            `/chat/private/${user.id}/${selectedUser._id}`
          );

        setMessages(res.data);

      } catch (err) {

        console.error(err);

      }

    };

  const sendMessage =
    async () => {

      console.log("Sending message:", text);
      if (!text.trim()) return;

      // PRIVATE MESSAGE
      if (selectedUser) {

        socket.emit(
          "privateMessage",
          {
            sender: user.id,
            receiver:
              selectedUser._id,
            content: text
          }
        );

      }

      // ROOM MESSAGE
      else {

        const messageData = {

          roomId: currentRoom,
          content: text,
          sender: user

        };

        await api.post(
          "/chat",
          messageData
        );

        socket.emit(
          "sendMessage",
          messageData
        );

      }

      setText("");

    };

  return (

    <div className="flex h-screen overflow-hidden bg-zinc-950">

      <Sidebar
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <div className="flex flex-col flex-1">

        <Navbar />

        <div className="p-4 border-b border-zinc-800 bg-zinc-900 text-white">

          <h2 className="font-bold">

            {selectedUser
              ? `Chat with ${selectedUser.name}`
              : `#${currentRoom}`}

          </h2>

        </div>

        <ChatWindow messages={messages} />

        <div className="p-4 border-t border-zinc-800 bg-zinc-900">

          <div className="flex gap-3">

            <input
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4"
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              placeholder={
                selectedUser
                  ? `Message ${selectedUser.name}...`
                  : `Message #${currentRoom}...`
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                sendMessage()
              }
            />

            <button
              onClick={sendMessage}
              className="px-10 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}