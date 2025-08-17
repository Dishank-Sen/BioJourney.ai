import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini embeddings model
const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "models/embedding-001", // Gemini embeddings model
    apiKey: process.env.GEMINI_API_KEY
});

export default async function getEmbedding(msg){
    const vector = await embeddings.embedQuery(msg);
    return vector;
}
