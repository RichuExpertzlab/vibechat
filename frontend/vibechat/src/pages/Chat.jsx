import { useEffect, useState, useContext } from "react";
import socket from "../services/socket";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatWindow from "../components/ChatWindow";
import { AuthContext } from "../context/AuthContext";

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [currentRoom, setCurrentRoom] = useState("general");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!user) return;

    // Join the selected room
    socket.emit("joinRoom", currentRoom);

    socket.on("receiveMessage", (message) => {
      if (message.roomId === currentRoom) {
        setMessages((prev) => [...prev, message]);
      }
    });

    loadMessages();

    return () => socket.off("receiveMessage");
  }, [currentRoom, user]);

  const loadMessages = async () => {
    try {
      const res = await api.get(`/chat/${currentRoom}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const messageData = {
      roomId: currentRoom,
      content: text,
      sender: user,
    };

    await api.post("/chat", messageData);
    socket.emit("sendMessage", messageData);

    setText("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <Sidebar currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
      
      <div className="flex flex-col flex-1">
        <Navbar />
        <ChatWindow messages={messages} />
        
        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
          <div className="flex gap-3">
            <input
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Message #${currentRoom}...`}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-10 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-medium transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>



  );
}