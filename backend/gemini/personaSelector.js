import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import promptTemplate from "../langchain/promptTemplate.js";
import safeJSON from "../utils/safeJSON.js";

dotenv.config();

const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY
});


export default async function selectPersona(msg,replacements){
    const baseData = JSON.stringify(
        {
        appName: "CarePath AI",
        version: "1.0",
        userProfile: { name: "John Doe", age: 30 }
        },
        null,
        2
    );
    const fileName = "select_persona.md"
    const selectorTemplate = promptTemplate(fileName, replacements);
    const selectorPrompt = await selectorTemplate.format({
        BASE_DATA: baseData,
        USER_MESSAGE: msg
    });

    const selection = await chatModel.invoke(selectorPrompt);
    const parsed = safeJSON(selection.content);
    return parsed;
}