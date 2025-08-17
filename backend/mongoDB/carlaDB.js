import CarlaNutrition from "../models/carla.js";
import mongoose from "mongoose";

export async function saveCarlaData(userId, carlaData) {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected yet");
    }

    if (!userId) throw new Error("userId is required");
    if (!carlaData) throw new Error("carlaData is required");

    // Check if extracted has at least 1 non-empty nutrition field
    const hasData =
      ["dietary_preference", "allergies", "breakfast", "lunch", "dinner", "medication", "exercise"].some(
        (category) => carlaData.extracted?.[category]?.length > 0
      );

    if (!hasData) {
      console.log("⚠️ No relevant Carla nutrition data found. Skipping save.");
      return null;
    }

    let existingUser = await CarlaNutrition.findOne({ userId });
    if (!existingUser) {
      // Create a new entry if one doesn't exist
      console.log("Creating new entry for Carla...");
      const entry = new CarlaNutrition({
        userId,
        extracted: carlaData.extracted,
        changes_detected: carlaData.changes_detected || { new: {}, updated: {} }
      });

      const savedEntry = await entry.save();
      console.log("✅ New Carla data saved:", savedEntry._id);
      return savedEntry;
    }

    // --- User Exists: Append Data ---

    // 1. Append to arrays inside 'extracted'
    for (const category of ["dietary_preference", "allergies", "breakfast", "lunch", "dinner"]) {
      if (carlaData.extracted?.[category]?.length > 0) {
        existingUser.extracted[category] = [
          ...(existingUser.extracted[category] || []),
          ...carlaData.extracted[category],
        ];
      }
    }

    // 2. Append to arrays inside 'changes_detected' (THE FIX)
    if (carlaData.changes_detected) {
      // Loop through both 'new' and 'updated' tags
      for (const tag of ['new', 'updated']) {
        if (carlaData.changes_detected[tag]) {
          // Loop through each category (e.g., 'allergies', 'medication') within the tag
          for (const category in carlaData.changes_detected[tag]) {
            const incomingEntries = carlaData.changes_detected[tag][category];

            // Ensure there are entries to add
            if (Array.isArray(incomingEntries) && incomingEntries.length > 0) {
              // Get the existing entries, or an empty array if it doesn't exist yet
              const existingEntries = existingUser.changes_detected[tag]?.[category] || [];

              // Append the new entries to the existing ones
              existingUser.changes_detected[tag][category] = [
                ...existingEntries,
                ...incomingEntries,
              ];
            }
          }
        }
      }
    }

    const updatedUser = await existingUser.save();
    console.log("✅ Carla data appended:", updatedUser._id);
    return updatedUser;
  } catch (err) {
    console.error("❌ Error saving Carla data:", err.message);
    throw err;
  }
}