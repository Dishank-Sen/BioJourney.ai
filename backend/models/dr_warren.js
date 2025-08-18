import mongoose from "mongoose";

const MedicationSchema = new mongoose.Schema({
  medication_name: String,
  dosage: String,
  frequency: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const TestResultSchema = new mongoose.Schema({
  test_name: String,
  value: String,
  unit: String,
  reference_range: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const DiseaseSchema = new mongoose.Schema({
  condition_name: String,
  classification: { type: String, enum: ["chronic", "acute", "preventive_risk"] },
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "high" }
});

const HealthChangeSchema = new mongoose.Schema({
  metric: String,
  direction: String,
  value: String,
  duration: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const DrWarrenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  count: {type: Number, default: 0},
  extracted: {
    medication: [MedicationSchema],
    test_results: [TestResultSchema],
    diseases: [DiseaseSchema],
    health_change: [HealthChangeSchema]
  },
  changes_detected: {
    new: {
      medication: [MedicationSchema],
      test_results: [TestResultSchema],
      diseases: [DiseaseSchema],
      health_change: [HealthChangeSchema]
    },
    updated: {
      medication: [MedicationSchema],
      test_results: [TestResultSchema],
      diseases: [DiseaseSchema],
      health_change: [HealthChangeSchema]
    }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DrWarren", DrWarrenSchema);
