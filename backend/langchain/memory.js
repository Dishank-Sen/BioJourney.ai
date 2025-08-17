import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { BufferMemory, BufferWindowMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";
import dotenv from "dotenv";

dotenv.config();

export async function createMemoryBundle() {
  // Create the Gemini model
//   const model = new ChatGoogleGenerativeAI({
//     model: "gemini-1.5-flash",
//     apiKey: process.env.GEMINI_API_KEY,
//   });

  // recent chats
  const recentMemory = new BufferWindowMemory({
    k: 10,
    returnMessages: true,
    memoryKey: "recent_messages",
  });

  // Create different memory types
  const retriever = new BufferMemory({
    chatHistory: new ChatMessageHistory(),
    returnMessages: true,
    memoryKey: "history",
  });

  const tags = new BufferMemory({
    chatHistory: new ChatMessageHistory(),
    returnMessages: true,
    memoryKey: "history",
  });

  const summary = new BufferMemory({
    chatHistory: new ChatMessageHistory(),
    returnMessages: true,
    memoryKey: "history",
  });

//   const window = new BufferMemory({
//     chatHistory: new ChatMessageHistory(),
//     returnMessages: true,
//     memoryKey: "history",
//   });


//   const saveAIoutput = async () => {
      
//   }
  // Create a simple conversation chain for summary
//   const fileName = "past_conversation.md"
//   const replacements = ["CHAT_HISTORY","USER_MESSAGE"]
//   const selectorTemplate = promptTemplate(fileName, replacements);
//   const selectorPrompt = await selectorTemplate.format({
//     CHAT_HISTORY: baseData,
//     USER_MESSAGE: msg
//   });

//   const conversationChain = new ConversationChain({
//     llm: model,
//     selectorPrompt,
//     memory: retriever,
//   });

  // Return structured bundle so generateContent() works
  return {
    retriever,
    summary,
    tags,
    recentMemory
  };
}
