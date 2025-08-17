import RachelPhysio from "../models/rachel.js";
import mongoose from "mongoose";

export async function saveRachelData(userId, rachelData) {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected yet");
    }

    if (!userId) throw new Error("userId is required");
    if (!rachelData) throw new Error("rachelData is required");

    // Check if extracted has relevant physio info
    const hasData =
      ["exercises", "mobility_rehab", "injury", "progress"].some(
        (category) => rachelData.extracted?.[category]?.length > 0
      );

    if (!hasData) {
      console.log("⚠️ No relevant Rachel physiotherapy data found. Skipping save.");
      return null;
    }

    let existingUser = await RachelPhysio.findOne({ userId });
    if(!existingUser){
      // Create entry
      console.log("creating new entry...")
      const entry = new RachelPhysio({
        userId,
        extracted: rachelData.extracted,
        changes_detected: rachelData.changes_detected || { new: {}, updated: {} }
      });

      // Save to DB
      console.log("saving new entry....")
      const savedEntry = await entry.save();
      console.log("✅ Rachel data saved:", savedEntry._id);

      return savedEntry;
    }

    // Append to arrays inside extracted
    for (let category of ["exercises", "mobility_rehab", "injury", "progress"]) {
      if (rachelData.extracted?.[category]?.length > 0) {
        existingUser.extracted[category] = [
          ...(existingUser.extracted[category] || []),
          ...rachelData.extracted[category],
        ];
      }
    }

    // 2. Append to arrays inside 'changes_detected' (THE FIX)
    if (rachelData.changes_detected) {
      // Loop through both 'new' and 'updated' tags
      for (const tag of ['new', 'updated']) {
        if (rachelData.changes_detected[tag]) {
          // Loop through each category (e.g., 'allergies', 'medication') within the tag
          for (const category in rachelData.changes_detected[tag]) {
            const incomingEntries = rachelData.changes_detected[tag][category];

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
    console.log("✅ Rachel data appended:", updatedUser._id);
    return updatedUser;
  } catch (err) {
    console.error("❌ Error saving Rachel data:", err.message);
    throw err;
  }
}
