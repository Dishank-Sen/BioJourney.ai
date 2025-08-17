import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  exercise_name: String,
  duration: String,
  frequency: String,
  intensity: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const MobilityRehabSchema = new mongoose.Schema({
  movement: String,
  limitation: String,
  pain_level: String,
  duration: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const InjurySchema = new mongoose.Schema({
  injury_name: String,
  severity: { type: String, enum: ["mild", "moderate", "severe"] },
  location: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "high" }
});

const ProgressSchema = new mongoose.Schema({
  metric: String,
  direction: String,
  value: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const RachelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  extracted: {
    exercise: [ExerciseSchema],
    mobility_rehab: [MobilityRehabSchema],
    injury: [InjurySchema],
    progress: [ProgressSchema]
  },
  changes_detected: {
    new: {
      exercise: [ExerciseSchema],
      mobility_rehab: [MobilityRehabSchema],
      injury: [InjurySchema],
      progress: [ProgressSchema]
    },
    updated: {
      exercise: [ExerciseSchema],
      mobility_rehab: [MobilityRehabSchema],
      injury: [InjurySchema],
      progress: [ProgressSchema]
    }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("RachelPhysio", RachelSchema);
