import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";
import getEmbedding from "../gemini/getEmbedding.js";
import getConversation from "../pinecone/getConversation.js";
import generateRandomId from "../utils/generateId.js";
import extractEntities from "../gemini/entitiesGenerator.js";
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const tier3Index = pinecone.index("tier3");
const tier4Index = pinecone.index("tier4");


export default async function tier3ToTier4() {
  console.log("Running scheduled long-term maintenance job...");

  try {
    // --- Process Tier 3 -> Tier 4  ---
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 3);
    const oneMonthAgoISO = oneMonthAgo.toISOString();

    const t3Results = await tier3Index.query({
      topK: 1000, // Process up to 1000 vectors (500 turns) per run
      vector: Array(768).fill(0),
      includeMetadata: true,
      filter: { "timestamp": { "$lt": oneMonthAgoISO } }
    });

    const tempTier3 = t3Results;

    if (t3Results.matches.length > 0) {
      // Form the conversation pair
      t3Results.matches = await Promise.all(
        t3Results.matches.map((result) => getConversation(result, "tier3"))
      );

      // Create a summary for each individual pair
      const entitiesResults = extractEntities(t3Results.matches)
      // --- Create and store the USER vector ---
      (async function(){
        for (const entiry of entitiesResults.array) {
          const ID = generateRandomId();

          const userVector = {
            id: `${ID}-user`,
            values: await getEmbedding(entiry.user),
            metadata: {
              text: entiry.user,
              type: "user",
              conversationId: ID,
            },
          };

          const assistantVector = {
            id: `${ID}-assistant`,
            values: await getEmbedding(entiry.assistant),
            metadata: {
              text: entiry.assistant,
              type: "assistant",
              conversationId: ID,
            },
          };

          await tier4Index.upsert([userVector, assistantVector]);
        }
      })();

      // Step 5: Delete the original verbatim vectors from Tier 3
      const idsToDeleteFromT3 = tempTier3.matches.map(m => m.id);
      await tier4Index.delete({ ids: idsToDeleteFromT3 });
      console.log(`Deleted ${idsToDeleteFromT3.length} original vectors from Tier 3.`);
    }

  } catch (error) {
    console.error("Error during long-term maintenance:", error);
  }
}