export default function formatChatHistory(memoryVars) {
  if (!memoryVars || !Array.isArray(memoryVars.history)) return "";

  return memoryVars.history
    .map(msg => {
      let role;
      if (msg._getType?.() === "human" || msg.constructor.name === "HumanMessage") {
        role = "User";
      } else if (msg._getType?.() === "ai" || msg.constructor.name === "AIMessage") {
        role = "Assistant";
      } else {
        role = msg._getType?.() || "Unknown";
      }
      return `${role}: ${msg.content || ""}`;
    })
    .join("\n");
}
