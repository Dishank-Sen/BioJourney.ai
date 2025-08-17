import RubyConcierge from "../models/ruby.js";
import mongoose from "mongoose";

export async function saveRubyData(userId, rubyData) {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected yet");
    }

    if (!userId) throw new Error("userId is required");
    if (!rubyData) throw new Error("rubyData is required");

    const hasData =
      ["appointments", "reminders", "follow_ups", "tasks"].some(
        (category) => rubyData.extracted?.[category]?.length > 0
      );

    if (!hasData) {
      console.log("⚠️ No relevant Ruby data found. Skipping save.");
      return null;
    }

    let existingUser = await RubyConcierge.findOne({ userId });
    if(!existingUser){
      // Create entry
      console.log("creating new entry...")
      const entry = new RubyConcierge({
        userId,
        extracted: rubyData.extracted,
        changes_detected: rubyData.changes_detected || { new: {}, updated: {} }
      });

      // Save to DB
      console.log("saving new entry....")
      const savedEntry = await entry.save();
      console.log("✅ Ruby data saved:", savedEntry._id);

      return savedEntry;
    }

    // Append to arrays inside extracted
    for (let category of ["appointments", "reminders", "follow_ups", "tasks"]) {
      if (rubyData.extracted?.[category]?.length > 0) {
        existingUser.extracted[category] = [
          ...(existingUser.extracted[category] || []),
          ...rubyData.extracted[category],
        ];
      }
    }

    // 2. Append to arrays inside 'changes_detected' (THE FIX)
    if (rubyData.changes_detected) {
      // Loop through both 'new' and 'updated' tags
      for (const tag of ['new', 'updated']) {
        if (rubyData.changes_detected[tag]) {
          // Loop through each category (e.g., 'allergies', 'medication') within the tag
          for (const category in rubyData.changes_detected[tag]) {
            const incomingEntries = rubyData.changes_detected[tag][category];

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
    console.log("✅ Ruby data appended:", updatedUser._id);
    return updatedUser;
  } catch (err) {
    console.error("❌ Error saving Ruby data:", err.message);
    throw err;
  }
}
