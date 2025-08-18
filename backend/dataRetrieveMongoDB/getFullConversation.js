import Conversation from "../models/conversation.js";

export default async function getFullConversation(userId){
    try {
        const userConversation = await Conversation.findOne({userId: userId})
        return userConversation;
    } catch (error) {
        console.log("error in getting conversation:", error)
    }
}