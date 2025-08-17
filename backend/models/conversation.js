import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  conversation: [
    { 
      userReply: {type: String}, 
      assistantReply: {type: String},
      persona: {type: String},
      createdAt: { type: Date, default: Date.now } 
    }]
});

export default mongoose.model("Conversation", ConversationSchema);
