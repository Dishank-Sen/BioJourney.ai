import mongoose from "mongoose";

const MetricSchema = new mongoose.Schema({
  metric: { type: String, required: true },
  value: { type: String },
  unit: { type: String },
  reference_range: { type: String },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const AdvikSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  count: {type: Number, default: 0},
  extracted: {
    sleep: [MetricSchema],
    recovery: [MetricSchema],
    hrv: [MetricSchema],
    stress: [MetricSchema],
  },

  changes_detected: {
    new: {
      sleep: [MetricSchema],
      recovery: [MetricSchema],
      hrv: [MetricSchema],
      stress: [MetricSchema],
    },
    updated: {
      sleep: [MetricSchema],
      recovery: [MetricSchema],
      hrv: [MetricSchema],
      stress: [MetricSchema],
    },
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AdvikPerformance", AdvikSchema);
