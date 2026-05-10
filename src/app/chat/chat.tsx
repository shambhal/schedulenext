"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  sender: string;
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws/chat");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.current.onclose = () => console.log("WebSocket closed");

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      sender: "client",
      text: input,
    };

    ws.current?.send(JSON.stringify(msg));
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto w-full max-w-md bg-white shadow rounded flex flex-col">
        <div className="p-3 border-b font-semibold">Chat</div>

        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded text-sm max-w-[75%]
                ${m.sender === "client"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200"}
              `}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="p-2 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
            placeholder="Type message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-3 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
