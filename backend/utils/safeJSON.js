export default function safeJSON(text){
    const textData = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(textData);
    return parsed;
}