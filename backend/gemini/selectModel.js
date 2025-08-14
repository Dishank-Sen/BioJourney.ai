import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import loadPromptTemplate from "../utils/loadPromtTemplate.js";

dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function selectModel(msg){
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

    const prompt = loadPromptTemplate(
        fileName,
        {
        BASE_DATA: baseData,
        USER_MESSAGE: msg
        }
    );

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return responseText;
    } catch (err) {
        console.error("Gemini API error:", err);
        return null;
    }
}