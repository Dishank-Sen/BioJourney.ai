import React, { useState } from "react";

export default function GeminiChat() {
  const [userInput, setUserInput] = useState("");

  // Function to send prompt to Gemini API
  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput;
    setUserInput("");

    try {
      const res = await fetch(`https://${import.meta.env.VITE_EC2_ENDPOINT}/api/getContent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({msg})
      });

      const data = await res.json();
      console.log(data)
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
    }
  };

  return (
    <>
        <div>
            <p></p>
        </div>
        <div className="flex gap-2">
            <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
            />
            <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded"
            >
            Send
            </button>
        </div>
    </>
  );
}
