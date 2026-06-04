import { useEffect, useRef } from "react";

export default function ChatWindow({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-zinc-950">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <p className="text-2xl mb-2">👋</p>
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div className="text-xs text-gray-500 mb-1 pl-3">
              {msg.sender?.name || "User"}
            </div>
            <div className="max-w-[70%] px-5 py-3 bg-white dark:bg-zinc-800 rounded-3xl rounded-tl-none shadow">
              <p className="text-[15px]">{msg.content}</p>
              <p className="text-[10px] text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))
      )}
      <div ref={endRef} />
    </div>
  );
}