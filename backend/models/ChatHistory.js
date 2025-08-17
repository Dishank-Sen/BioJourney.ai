import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    intent: String,
    needs_past_context: Boolean,
    importance: { type: String, enum: ["high", "medium", "low"] }
  }
}, { _id: false });

const chatHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [messageSchema]
});

export default mongoose.model("ChatHistory", chatHistorySchema);
