import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import promptTemplate from "../langchain/promptTemplate.js";
import safeJSON from "../utils/safeJSON.js";
import formatConversationToString from "../utils/formatConversationToString.js";

dotenv.config();

const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY
});

export default async function extractEntities(summaryArray) {
  try {
    const batchSize = 10; // Process 10 summaries at a time
    const entityPromises = [];

    // Create batches of 10 summaries
    for (let i = 0; i < summaryArray.length; i += batchSize) {
      const batch = summaryArray.slice(i, i + batchSize);
      
      const entityPromise = (async () => {
        const fileName = "entities.md"; // Your specific prompt for entity extraction
        const replacements = ["SUMMARY_BLOCK"];
        const selectorTemplate = promptTemplate(fileName, replacements);

        // Format the text from the summary objects into a single string block
        const summaryString = formatConversationToString(batch)

        const selectorPrompt = await selectorTemplate.format({
          SUMMARY_BLOCK: summaryString
        });

        const selection = await chatModel.invoke(selectorPrompt);
        // The LLM should return a JSON array of entities, which we parse.
        const parsed = safeJSON(selection.content); 
        return parsed;
      })();
      
      entityPromises.push(entityPromise);
    }

    // Wait for all the entity extraction promises to resolve concurrently
    const allEntityBatches = await Promise.all(entityPromises);
    
    return allEntityBatches.filter(entity => entity !== null);
  } catch (error) {
    console.error("Error during entity extraction process:", error);
    return []; // Return an empty array on failure
  }
}