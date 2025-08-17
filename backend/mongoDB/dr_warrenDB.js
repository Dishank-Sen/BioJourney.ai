import DrWarren from "../models/dr_warren.js";
import mongoose from "mongoose";

export async function saveDrWarrenData(userId, drWarrenData) {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected yet");
    }

    if (!userId) throw new Error("userId is required");
    if (!drWarrenData) throw new Error("drWarrenData is required");

    // Check if extracted has at least 1 non-empty category
    const hasData =
      ["medication", "test_results", "diseases", "health_change"].some(
        (category) => drWarrenData.extracted?.[category]?.length > 0
      );

    if (!hasData) {
      console.log("⚠️ No relevant Dr. Warren data found. Skipping save.");
      return null;
    }

    let existingUser = await DrWarren.findOne({ userId });
    if(!existingUser){
      // Create entry
      console.log("creating new entry...")
      const entry = new DrWarren({
        userId,
        extracted: drWarrenData.extracted,
        changes_detected: drWarrenData.changes_detected || { new: {}, updated: {} }
      });

      // Save to DB
      console.log("saving new entry....")
      const savedEntry = await entry.save();
      console.log("✅ Advik data saved:", savedEntry._id);

      return savedEntry;
    }

    // Append to arrays inside extracted
    for (let category of ["medication", "test_results", "diseases", "health_change"]) {
      if (drWarrenData.extracted?.[category]?.length > 0) {
        existingUser.extracted[category] = [
          ...(existingUser.extracted[category] || []),
          ...drWarrenData.extracted[category],
        ];
      }
    }

    // 2. Append to arrays inside 'changes_detected' (THE FIX)
    if (drWarrenData.changes_detected) {
      // Loop through both 'new' and 'updated' tags
      for (const tag of ['new', 'updated']) {
        if (drWarrenData.changes_detected[tag]) {
          // Loop through each category (e.g., 'allergies', 'medication') within the tag
          for (const category in drWarrenData.changes_detected[tag]) {
            const incomingEntries = drWarrenData.changes_detected[tag][category];

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
    console.log("✅ Dr Warren data appended:", updatedUser._id);
    return updatedUser;
  } catch (err) {
    console.error("❌ Error saving Dr. Warren data:", err.message);
    throw err;
  }
}
