import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const dimension = 768;

export default async function createIndex(indexName) {
  // Check if the index already exists before trying to create
  const existingIndexes = (await pinecone.listIndexes()).indexes.map(i => i.name);
  
  if (existingIndexes.includes(indexName)) {
    console.log(`Index "${indexName}" already exists. Skipping creation.`);
    return;
  }

  console.log(`Creating index "${indexName}"...`);
  await pinecone.createIndex({
    name: indexName,
    dimension: dimension,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  });

  console.log(
    `Index "${indexName}" created successfully.`
  );
};