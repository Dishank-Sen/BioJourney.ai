import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";
import getEmbedding from "../gemini/getEmbedding.js";
import createIndex from "./createIndex.js";

// A helper function to add a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function retrieveData(userMsg, indexName, topK) {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // 1. Get the list of all indexes
    const existingIndexes = (await pinecone.listIndexes()).indexes.map(i => i.name);
    
    // 2. Check if the desired index is in the list
    if (!existingIndexes.includes(indexName)) {
      // If it's not, create it
      await createIndex(indexName);
      // It's a good practice to wait a bit for the index to initialize
      await delay(5000); // Wait 5 seconds
    }

    // 3. Now, get the handle to the index and proceed
    const index = pinecone.index(indexName);
    const queryEmbedding = await getEmbedding(userMsg);

    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: topK,
      includeMetadata: true,
    });
    
    return queryResponse.matches;
  } catch (error) {
    console.log("error pinecone retrieving:", error);
    return [];
  }
}