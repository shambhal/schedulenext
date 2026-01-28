"use client";
import { useEffect, useState } from "react";

export default function ChatWidget() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/chat/");

    socket.onmessage = (event) => {
        const msg = JSON.parse(e.data);

  if (msg.type === "system") {
   setMessages(msg.text); // "No one is available"
  } else {
    setMessages(prev => [...prev, msg]);
  }
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  const sendMessage = (text: string) => {
    ws?.send(JSON.stringify({ text, sender: "guest" }));
  };

  return (
  <div className="fixed bottom-4 right-4 w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col">
     <div className="p-3 border-b font-semibold">Chat</div>
    <div>
     
      {messages.map((m, i) => (
        <div key={i}>{m.sender}: {m.text}</div>
      ))}
 <button onClick={() => sendMessage("Hello!")}>Send</button>
      </div>
    </div>
  );
}
