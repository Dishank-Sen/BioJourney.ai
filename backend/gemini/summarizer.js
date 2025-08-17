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

export default async function summarize(conversationArray) {
  try {
    const batchSize = 10;
    const summaryPromises = [];

    // Create batches of 10 conversations
    for (let i = 0; i < conversationArray.length; i += batchSize) {
      const batch = conversationArray.slice(i, i + batchSize);
      
      // For each batch, create a promise that will resolve to its summary
      const summaryPromise = (async () => {
        const fileName = "summarize.md"; // Your prompt template file
        const replacements = ["USER_CHAT"];
        const selectorTemplate = promptTemplate(fileName, replacements);

        // Format the current batch of conversations into a single string
        const conversationString = formatConversationToString(batch);

        const selectorPrompt = await selectorTemplate.format({
          USER_CHAT: conversationString
        });

        const selection = await chatModel.invoke(selectorPrompt);
        const parsed = safeJSON(selection.content);
        return parsed;
      })();
      
      summaryPromises.push(summaryPromise);
    }

    // Wait for all the summarization promises to resolve concurrently
    const allSummaries = await Promise.all(summaryPromises);
    
    // Filter out any null results from failed JSON parsing
    return allSummaries.filter(summary => summary !== null);

  } catch (error) {
    console.error("Error during summarization process:", error);
    return []; // Return an empty array on failure
  }
}