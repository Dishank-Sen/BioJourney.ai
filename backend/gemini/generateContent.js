import dotenv from "dotenv";
import selectPersona from "./personaSelector.js";
import promptTemplate from "../langchain/promptTemplate.js";
import safeJSON from "../utils/safeJSON.js";
import { getUserMemory, setUserMemory } from "../langchain/userStore.js";
import { createMemoryBundle } from "../langchain/memory.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import storeData from "../pinecone/storeData.js";
import getSimilarResult from "./getSimilarResult.js";
import formatConversationForLLM from "../utils/formatConversationForLLM.js";
import { saveAdvikData } from "../mongoDB/advikDB.js";
import { saveCarlaData } from "../mongoDB/carlaDB.js";
import { saveNeelData } from "../mongoDB/neelDB.js";
import { saveRachelData } from "../mongoDB/rachelDB.js";
import { saveRubyData } from "../mongoDB/rubyDB.js";
import { saveDrWarrenData } from "../mongoDB/dr_warrenDB.js";
import { saveConversation } from "../mongoDB/conversationDB.js";
import formatBioProfile from "../utils/formatBioProfile.js";

dotenv.config();

const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY
});

export default async function generateContent(msg,userId){
    try {
        let bundle = getUserMemory(userId);
        if (!bundle) {
            bundle = await createMemoryBundle();
            setUserMemory(userId, bundle);
        }
        // selecting persona
        const persona = await selectPersona(msg,["BASE_DATA", "USER_MESSAGE"]);
        const fileName = persona.selected_expert + ".md";
        const replacements = ["BASE_DATA", "CHAT_HISTORY", "USER_MESSAGE", "BIO_PROFILE"]
        const selectorTemplate = promptTemplate(fileName, replacements);
        
        const queryResponse = await getSimilarResult(msg);
        const formatConversation = formatConversationForLLM(queryResponse)
        
        const baseData = JSON.stringify(
            {
            appName: "BioJourney.ai",
            version: "1.0",
            userProfile: { name: "Dishank Sen", age: 19 }
            },
            null,
            2
        );
        const formatBioData = await formatBioProfile(userId, persona.selected_expert)
    
        console.log("model selected:", persona.selected_expert)
        
        const selectorPrompt = await selectorTemplate.format({
            BASE_DATA: baseData,
            CHAT_HISTORY: formatConversation,
            USER_MESSAGE: msg,
            BIO_PROFILE: formatBioData
        });
        console.log("selector prompt:",selectorPrompt)
    
        const selection = await chatModel.invoke(selectorPrompt);

        const parsed = safeJSON(selection.content);
        console.log(parsed)

        await storeData({user:msg, assistant:parsed.summary},"tier1")
        if(persona.selected_expert === 'advik'){
            await saveAdvikData(userId,parsed)
            await saveConversation(userId, {userReply: msg, assistantReply: parsed.reply}, persona.selected_expert)
        }else if(persona.selected_expert == 'carla'){
            await saveCarlaData(userId,parsed)
            await saveConversation(userId, {userReply: msg, assistantReply: parsed.reply}, persona.selected_expert)
        }else if(persona.selected_expert == 'dr_warren'){
            await saveDrWarrenData(userId,parsed)
            await saveConversation(userId, {userReply: msg, assistantReply: parsed.reply}, persona.selected_expert)
        }else if(persona.selected_expert == 'neel'){
            await saveNeelData(userId,parsed)
            await saveConversation(userId, {userReply: msg, assistantReply: parsed.reply}, persona.selected_expert)
        }else if(persona.selected_expert == 'rachel'){
            await saveRachelData(userId,parsed)
            await saveConversation(userId, {userReply: msg, assistantReply: parsed.reply}, persona.selected_expert)
        }else if(persona.selected_expert == 'ruby'){
            await saveRubyData(userId,parsed)
            await saveConversation(userId, {userReply: msg, assistantReply: parsed.reply}, persona.selected_expert)
        }
        return parsed;
    } catch (err) {
        console.error("Gemini API error:", err);
        return null;
    }
}