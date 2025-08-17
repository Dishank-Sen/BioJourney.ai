import mongoose from "mongoose";
import Conversation from "../models/conversation.js";

export async function saveConversation(userId, conversationData, personaName) {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected yet");
    }

    if (!userId) throw new Error("userId is required");
    if (!conversationData) throw new Error("conversationData is required");
    if (!personaName) throw new Error("persona is required");

    // Find existing user
    let existingUser = await Conversation.findOne({ userId });

    if (!existingUser) {
      // Create new entry with the first conversation
      console.log("📌 Creating new conversation entry...");

      const entry = new Conversation({
        userId,
        conversation: [
          {
            userReply: conversationData.userReply,
            assistantReply: conversationData.assistantReply,
            persona: personaName,
            createdAt: new Date(),
          },
        ],
      });

      const savedEntry = await entry.save();
      console.log("✅ New conversation saved:", savedEntry._id);
      return savedEntry;
    } else {
      // Append new conversation
      console.log("📌 Appending new conversation...");

      existingUser.conversation.push({
        userReply: conversationData.userReply,
        assistantReply: conversationData.assistantReply,
        persona: personaName,
        createdAt: new Date(),
      });

      const updatedEntry = await existingUser.save();
      console.log("✅ Conversation updated:", updatedEntry._id);
      return updatedEntry;
    }
  } catch (err) {
    console.error("❌ Error saving conversation:", err.message);
    throw err;
  }
}
