import mongoose from "mongoose";
import { type } from "os";

const MealSchema = new mongoose.Schema({
  item_suggested: { type: String },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const AllergySchema = new mongoose.Schema({
  allergy_name: { type: String },
  caused_by: {type: String},
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const DietaryPreferenceSchema = new mongoose.Schema({
  type: { type: String },
  reason: { type: String },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" },
  timestamp: { type: Date, default: Date.now }
});

const CarlaSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  count: {type: Number, default: 0},
  extracted: {
    dietary_preference: [DietaryPreferenceSchema],
    allergies: [AllergySchema],
    breakfast: [MealSchema],
    lunch: [MealSchema],
    dinner: [MealSchema],
  },

  changes_detected: {
    new: {
      dietary_preference: [DietaryPreferenceSchema],
      allergies: [AllergySchema],
      breakfast: [MealSchema],
      lunch: [MealSchema],
      dinner: [MealSchema],
    },
    updated: {
      dietary_preference: [DietaryPreferenceSchema],
      allergies: [AllergySchema],
      breakfast: [MealSchema],
      lunch: [MealSchema],
      dinner: [MealSchema],
    },
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CarlaNutrition", CarlaSchema);
