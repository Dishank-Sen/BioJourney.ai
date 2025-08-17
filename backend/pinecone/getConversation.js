import { Pinecone } from "@pinecone-database/pinecone";

export default async function getConversation(knownVector, pineconeIndex) {
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pinecone.index(pineconeIndex);

  // 1. Extract the necessary info from the vector you already have.
  const { text, type: knownType, conversationId } = knownVector.metadata;

  if (!conversationId || !knownType) {
    console.error("Vector metadata is missing conversationId or type.");
    console.log(knownVector.text)
    return null;
  }

  // 2. Determine the partner's type and construct its unique ID.
  const partnerType = knownType === "user" ? "assistant" : "user";
  const partnerId = `${conversationId}-${partnerType}`;

  // 3. Fetch the partner vector using its unique ID.
  try {
    const fetchResponse = await index.fetch([partnerId]);
    const partnerVector = fetchResponse.records[partnerId];

    if (!partnerVector) {
      console.warn(`Partner vector with ID "${partnerId}" not found.`);
      return null;
    }
    if(knownType === "user"){
        return {
            user: text,
            assistant: partnerVector.metadata.text
        }
    }else{
        return {
            user: partnerVector.metadata.text,
            assistant: text
        }
    }
  } catch (error) {
    console.error("Error fetching partner vector:", error);
    return null;
  }
}