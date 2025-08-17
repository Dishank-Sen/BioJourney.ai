import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const tier1Index = pinecone.index("tier1");
const tier2Index = pinecone.index("tier2");

export default async function tier1ToTier2() {
  try {
    console.log("Running job: Shifting older messages from Tier 1 to Tier 2...");

    const tier1Stats = await tier1Index.describeIndexStats();
    const vectorCount = tier1Stats.totalRecordCount || 0;
    console.log("vector count:", vectorCount);

    // Corrected logic to check against 20
    if (vectorCount <= 20) {
      console.log("Tier 1 has 20 or fewer messages. No shifting needed.");
      return;
    }

    const allVectorsResponse = await tier1Index.query({
      topK: 10000,
      vector: Array(768).fill(0),
      includeValues: true,
      includeMetadata: true,
    });

    const sortedVectors = allVectorsResponse.matches.sort(
      (a, b) => new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp)
    );
    console.log("sorted vectors length:", sortedVectors.length);

    const vectorsToMove = sortedVectors.slice(20);
    console.log("vector to move count:", vectorsToMove.length);

    if (vectorsToMove.length === 0) {
      console.log("No vectors identified to move. Job complete.");
      return;
    }

    // FIX #2: Re-map the array to create clean objects for the upsert command.
    // This strips out the unwanted 'score' property.
    const vectorsToUpsert = vectorsToMove.map(({ id, values, metadata }) => ({
      id,
      values,
      metadata,
    }));

    // 4. Upsert the CLEANED vectors into Tier 2
    console.log(`Moving ${vectorsToUpsert.length} vectors to Tier 2...`);
    await tier2Index.upsert(vectorsToUpsert);

    // 5. Delete the moved vectors from Tier 1
    const idsToDelete = vectorsToMove.map(v => v.id);
    console.log(`Deleting ${idsToDelete.length} vectors from Tier 1...`);
    await tier1Index.deleteMany(idsToDelete);

    console.log("Successfully shifted messages from Tier 1 to Tier 2.");

  } catch (error) {
    console.error("Error during Tier 1 to Tier 2 shifting:", error);
  }
}