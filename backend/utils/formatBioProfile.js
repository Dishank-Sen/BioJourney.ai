import CarlaNutrition from "../models/carla.js";
import DrWarren from "../models/dr_warren.js";
import RachelPhysio from "../models/rachel.js";
import AdvikPerformance from "../models/advik.js";
import NeelConcierge from "../models/neel.js";
import RubyConcierge from "../models/ruby.js";

// A helper function to format a single entry's details
function formatEntry(entry) {
  // We can remove fields we don't want to display in the final string
  const { _id, timestamp, __v, ...details } = entry;
  return Object.entries(details)
    .map(([key, value]) => `  - ${key.replace(/_/g, ' ')}: ${value}`)
    .join('\n');
}

// A helper function to process a section (like 'extracted' or 'new')
function processSection(sectionData) {
  let sectionString = "";
  for (const category in sectionData) {
    const entries = sectionData[category];
    if (Array.isArray(entries) && entries.length > 0) {
      // Capitalize the category name for the title
      const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
      sectionString += `\n**${categoryTitle}**\n`;
      sectionString += entries.map(entry => formatEntry(entry.toObject())).join('\n\n');
      sectionString += "\n";
    }
  }
  return sectionString;
}

// Main formatting function
function formatData(data, persona) {
  if (!data) {
    return `No data found for persona: ${persona}`;
  }

  let formattedString = `Bio-Profile Summary for ${persona.toUpperCase()}\n`;
  formattedString += "================================\n";

  // Process the main 'extracted' data
  if (data.extracted) {
    formattedString += "\n--- CURRENT DATA ---\n";
    formattedString += processSection(data.extracted);
  }

  // Process 'changes_detected'
  if (data.changes_detected) {
    const { new: newChanges, updated: updatedChanges } = data.changes_detected;

    if (Object.keys(newChanges).some(key => newChanges[key].length > 0)) {
        formattedString += "\n--- NEWLY DETECTED CHANGES ---\n";
        formattedString += processSection(newChanges);
    }
    
    if (Object.keys(updatedChanges).some(key => updatedChanges[key].length > 0)) {
        formattedString += "\n--- UPDATED RECORDS ---\n";
        formattedString += processSection(updatedChanges);
    }
  }

  return formattedString;
}

// Main function to fetch and format data for a specific persona
export default async function formatBioProfile(userId, persona) {
  // A map to easily select the correct Mongoose model
  const personaModels = {
    advik: AdvikPerformance,
    carla: CarlaNutrition,
    dr_warren: DrWarren,
    neel: NeelConcierge,
    rachel: RachelPhysio,
    ruby: RubyConcierge,
  };

  const Model = personaModels[persona];
  if (!Model) {
    return `Error: Persona "${persona}" is not recognized.`;
  }

  try {
    const userData = await Model.findOne({ userId: userId });

    if (!userData) {
      return `No data found for user ${userId} under persona ${persona}.`;
    }

    // Pass the fetched data to the formatting function
    return formatData(userData, persona);

  } catch (error) {
    console.error(`Error fetching data for persona ${persona}:`, error);
    return `An error occurred while fetching the bio-profile for ${persona}.`;
  }
}