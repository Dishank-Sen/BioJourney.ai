import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";
import generateRandomId from "../utils/generateId.js";
import getEmbedding from "../gemini/getEmbedding.js";

// {
//     user: "Tell me about the famous tower in Paris.",
//     assistant: "The Eiffel Tower is a wrought-iron lattice tower located on the Champ de Mars in Paris, France.",
// }
export default async function storeData(convo, indexName){
    try {
        
        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    
        const existingIndexes = (await pinecone.listIndexes()).indexes.map(i => i.name);
            
        if (!existingIndexes.includes(indexName)) {
            await createIndex(indexName);
            await delay(5000);
        }
        const index = pinecone.index(indexName);
        // console.log(`Connected to index: "${indexName}"`);
    
        const conversationId = generateRandomId();
    
        // --- Create and store the USER vector ---
        const userVector = {
          id: `${conversationId}-user`,
          values: await getEmbedding(convo.user),
          metadata: {
            text: convo.user,
            type: "user",
            conversationId: conversationId,
          },
        };
    
        // --- Create and store the ASSISTANT vector ---
        const assistantVector = {
          id: `${conversationId}-assistant`,
          values: await getEmbedding(convo.assistant),
          metadata: {
            text: convo.assistant,
            type: "assistant",
            conversationId: conversationId,
          },
        };
    
        // Upsert both vectors to the index
        await index.upsert([userVector, assistantVector]);
    } catch (error) {
        console.log("error pinecone saving:",error);
    }
}