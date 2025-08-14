import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import loadPromptTemplate from "../utils/loadPromtTemplate.js";
import selectModel from "./selectModel.js";

dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function generateContent(msg,chatHistory){
    const baseData = JSON.stringify(
        {
        appName: "CarePath AI",
        version: "1.0",
        userProfile: { name: "John Doe", age: 30 }
        },
        null,
        2
    );
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // selecting a model
        const persona = await selectModel(msg);
        const textData = persona.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(textData)
        console.log("model selected:", parsed.selected_expert)
        const fileName = parsed.selected_expert + ".md"
        const prompt = loadPromptTemplate(
            fileName,
            {
            BASE_DATA: baseData,
            CHAT_HISTORY: chatHistory || "No previous messages.",
            USER_MESSAGE: msg
            }
        );

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return responseText;
    } catch (err) {
        console.error("Gemini API error:", err);
        return null;
    }
}