import React, { useState, useRef, useEffect } from "react";

// C1: Chat Component
export default function C1() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "This is a simulated AI reply." }
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-700">
                AI
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-xl max-w-[70%] break-words shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <span className="block text-xs font-semibold mb-1">
                {msg.role === "user" ? "You" : "Assistant"}
              </span>
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                U
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input area fixed at bottom */}
      <div className="border-t p-3 bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}