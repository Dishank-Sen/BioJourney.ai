import mongoose from "mongoose";

const StrategicGoalSchema = new mongoose.Schema({
  goal: { type: String },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const RiskSchema = new mongoose.Schema({
  risk: { type: String },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const FeedbackSchema = new mongoose.Schema({
  feedback: { type: String },
  sentiment: { type: String, enum: ["positive", "neutral", "negative"], default: "neutral" },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const ProgramAlignmentSchema = new mongoose.Schema({
  area: { type: String },
  status: { type: String, enum: ["on_track", "off_track", "needs_attention"], default: "on_track" },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const NeelSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },

  extracted: {
    strategic_goals: [StrategicGoalSchema],
    risks: [RiskSchema],
    client_feedback: [FeedbackSchema],
    program_alignment: [ProgramAlignmentSchema],
  },

  changes_detected: {
    new: {
      strategic_goals: [StrategicGoalSchema],
      risks: [RiskSchema],
      client_feedback: [FeedbackSchema],
      program_alignment: [ProgramAlignmentSchema],
    },
    updated: {
      strategic_goals: [StrategicGoalSchema],
      risks: [RiskSchema],
      client_feedback: [FeedbackSchema],
      program_alignment: [ProgramAlignmentSchema],
    },
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("NeelConcierge", NeelSchema);
