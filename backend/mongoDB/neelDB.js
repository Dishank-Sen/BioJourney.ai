import NeelConcierge from "../models/neel.js";
import mongoose from "mongoose";

export async function saveNeelData(userId, neelData) {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected yet");
    }

    if (!userId) throw new Error("userId is required");
    if (!neelData) throw new Error("neelData is required");

    // Check if extracted has at least one non-empty category
    const hasData =
      ["strategic_goals", "risks", "client_feedback", "program_alignment"].some(
        (category) => neelData.extracted?.[category]?.length > 0
      );

    if (!hasData) {
      console.log("⚠️ No relevant Neel concierge data found. Skipping save.");
      return null;
    }

    let existingUser = await NeelConcierge.findOne({ userId });
    if(!existingUser){
      // Create entry
      console.log("creating new entry...")
      const entry = new NeelConcierge({
        userId,
        count: 1,
        extracted: neelData.extracted,
        changes_detected: neelData.changes_detected || { new: {}, updated: {} }
      });

      // Save to DB
      console.log("saving new entry....")
      const savedEntry = await entry.save();
      console.log("✅ Advik data saved:", savedEntry._id);

      return savedEntry;
    }

    existingUser.count = existingUser.count + 1;
    
    // Append to arrays inside extracted
    for (let category of ["strategic_goals", "risks", "client_feedback", "program_alignment"]) {
      if (neelData.extracted?.[category]?.length > 0) {
        existingUser.extracted[category] = [
          ...(existingUser.extracted[category] || []),
          ...neelData.extracted[category],
        ];
      }
    }

    // 2. Append to arrays inside 'changes_detected' (THE FIX)
    if (neelData.changes_detected) {
      // Loop through both 'new' and 'updated' tags
      for (const tag of ['new', 'updated']) {
        if (neelData.changes_detected[tag]) {
          // Loop through each category (e.g., 'allergies', 'medication') within the tag
          for (const category in neelData.changes_detected[tag]) {
            const incomingEntries = neelData.changes_detected[tag][category];

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
    console.log("✅ Neel data appended:", updatedUser._id);
    return updatedUser;
  } catch (err) {
    console.error("❌ Error saving Neel data:", err.message);
    throw err;
  }
}
