import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";
import getEmbedding from "../gemini/getEmbedding.js";
import summarize from "../gemini/summarizer.js";
import getConversation from "../pinecone/getConversation.js";
import generateRandomId from "../utils/generateId.js";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const tier2Index = pinecone.index("tier2");
const tier3Index = pinecone.index("tier3");
const tier4Index = pinecone.index("tier4");


export default async function tier2ToTier3() {
  console.log("Running scheduled long-term maintenance job...");

  try {
    // --- Part 1: Process Tier 2 -> Tier 3 (Summarize each turn) ---
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoISO = oneMonthAgo.toISOString();

    const t2Results = await tier2Index.query({
      topK: 1000, // Process up to 1000 vectors (500 turns) per run
      vector: Array(768).fill(0),
      includeMetadata: true,
      filter: { "timestamp": { "$lt": oneMonthAgoISO } }
    });

    const tempTier2 = t2Results;

    if (t2Results.matches.length > 0) {
      // Form the conversation pair
      t2Results.matches = await Promise.all(
        t2Results.matches.map((result) => getConversation(result, "tier2"))
      );

      // Create a summary for each individual pair
      const summaryResults = summarize(t2Results.matches)
      // --- Create and store the USER vector ---
      (async function(){
        for (const summary of summaryResults.array) {
          const ID = generateRandomId();

          const userVector = {
            id: `${ID}-user`,
            values: await getEmbedding(summary.user),
            metadata: {
              text: summary.user,
              type: "user",
              conversationId: ID,
            },
          };

          const assistantVector = {
            id: `${ID}-assistant`,
            values: await getEmbedding(summary.assistant),
            metadata: {
              text: summary.assistant,
              type: "assistant",
              conversationId: ID,
            },
          };

          await tier3Index.upsert([userVector, assistantVector]);
        }
      })();

      // Step 5: Delete the original verbatim vectors from Tier 2
      const idsToDeleteFromT2 = tempTier2.matches.map(m => m.id);
      await tier2Index.delete({ ids: idsToDeleteFromT2 });
      console.log(`Deleted ${idsToDeleteFromT2.length} original vectors from Tier 2.`);
    }

  } catch (error) {
    console.error("Error during long-term maintenance:", error);
  }
}