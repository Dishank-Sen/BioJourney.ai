import React, { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";

// Helper Function to Group Dates
const formatDateGroup = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function C1() {
  const [groupedConversations, setGroupedConversations] = useState({});
  const [selectedDateGroup, setSelectedDateGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [persona, setPersona] = useState("AI");
  const userId = "68a1ca9892c8c177a63ee0d0";

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`https://${import.meta.env.VITE_EC2_ENDPOINT}/api/getConversation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (res.ok) {
          const data = await res.json();
          console.log("API Data:", data);

          if (data.conversation && data.conversation.conversation) {
            const messagesByDate = data.conversation.conversation.reduce(
              (acc, msg) => {
                const dateKey = formatDateGroup(msg.createdAt);
                if (!acc[dateKey]) {
                  acc[dateKey] = [];
                }
                // ✅ FIX: Use push instead of unshift to maintain chronological order
                acc[dateKey].push(msg);
                return acc;
              },
              {}
            );
            setGroupedConversations(messagesByDate);
          }
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSelectConversation = (dateKey, messagesForDate) => {
    setSelectedDateGroup(dateKey);

    setMessages(
      messagesForDate
        .map((msg) => [
          msg.userReply && { role: "user", text: msg.userReply },
          msg.assistantReply && {
            role: "ai",
            text: msg.assistantReply,
            persona: msg.persona,
          },
        ])
        .flat()
        .filter(Boolean)
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`https://${import.meta.env.VITE_EC2_ENDPOINT}/api/getContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msg: input,
          userId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPersona(data.persona);
        const aiMsg = {
          role: "ai",
          text: data.response,
          persona: data.persona,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "Error fetching response." },
        ]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Unexpected error occurred." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const sortedConversationKeys = Object.keys(groupedConversations).sort((a, b) => {
      const dateA = a === "Today" ? new Date() : a === "Yesterday" ? new Date(Date.now() - 86400000) : new Date(a);
      const dateB = b === "Today" ? new Date() : b === "Yesterday" ? new Date(Date.now() - 86400000) : new Date(b);
      return dateB - dateA;
  });

  return (
    <div className="flex w-full" style={{ height: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-gray-100 border-r transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-3 border-b">
          <button
            className="p-2 rounded hover:bg-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
          {sidebarOpen && <h2 className="font-bold">Conversations</h2>}
        </div>

        <div className="flex-1 overflow-y-auto">
          {initialLoading ? (
            <p className="p-3 text-gray-500">Loading conversations...</p>
          ) : sortedConversationKeys.length === 0 ? (
            <p className="p-3 text-gray-500">No conversations yet</p>
          ) : (
            <ul>
              {sortedConversationKeys.map((dateKey) => (
                <li
                  key={dateKey}
                  className={`p-3 cursor-pointer hover:bg-gray-200 ${
                    selectedDateGroup === dateKey ? "bg-gray-300" : ""
                  }`}
                  onClick={() =>
                    handleSelectConversation(dateKey, groupedConversations[dateKey])
                  }
                >
                  {sidebarOpen ? (
                    <span className="font-medium">{dateKey}</span>
                  ) : (
                    <span className="truncate">#</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
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
                  {msg.role === "user" ? "You" : msg.persona || persona}
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
          {loading && (
            <div className="flex items-start gap-2 justify-start">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-700">
                AI
              </div>
              <div className="px-4 py-2 rounded-xl bg-gray-200 text-gray-900 shadow-sm animate-pulse">
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Box */}
        <div className="border-t p-3 bg-white flex items-center gap-2 sticky bottom-0">
          <textarea
            rows="1"
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}