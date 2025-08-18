import AdvikPerformance from "../models/advik.js";
import mongoose from "mongoose";

export async function saveAdvikData(userId, advikData) {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected yet");
    }

    if (!userId) throw new Error("userId is required");
    if (!advikData) throw new Error("advikData is required");

    // Check if extracted has at least 1 non-empty metric before saving
    const hasData =
      ["sleep", "recovery", "hrv", "stress"].some(
        (category) => advikData.extracted?.[category]?.length > 0
      );

    if (!hasData) {
      console.log("⚠️ No relevant Advik data found. Skipping save.");
      return null;
    }

    let existingUser = await AdvikPerformance.findOne({ userId });
    if(!existingUser){
      // Create entry
      console.log("creating new entry...")
      const entry = new AdvikPerformance({
        userId,
        count: 1,
        extracted: advikData.extracted,
        changes_detected: advikData.changes_detected || { new: {}, updated: {} }
      });

      // Save to DB
      console.log("saving new entry....")
      const savedEntry = await entry.save();
      console.log("✅ Advik data saved:", savedEntry._id);

      return savedEntry;
    }

    existingUser.count = existingUser.count + 1;
    // Append to arrays inside extracted
    for (let category of ["sleep", "recovery", "hrv", "stress"]) {
      if (advikData.extracted?.[category]?.length > 0) {
        existingUser.extracted[category] = [
          ...(existingUser.extracted[category] || []),
          ...advikData.extracted[category],
        ];
      }
    }

    // 2. Append to arrays inside 'changes_detected' (THE FIX)
    if (advikData.changes_detected) {
      // Loop through both 'new' and 'updated' tags
      for (const tag of ['new', 'updated']) {
        if (advikData.changes_detected[tag]) {
          // Loop through each category (e.g., 'allergies', 'medication') within the tag
          for (const category in advikData.changes_detected[tag]) {
            const incomingEntries = advikData.changes_detected[tag][category];

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
    console.log("✅ Advik data appended:", updatedUser._id);
    return updatedUser;
  } catch (err) {
    console.error("❌ Error saving Advik data:", err.message);
    throw err;
  }
}
