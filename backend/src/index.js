import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import generateContent from "../gemini/generateContent.js";

// Get the absolute path of the current file
const __filename = fileURLToPath(import.meta.url);

// Get the directory of the current file
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/getContent", async (req, res) => {
  const { msg } = req.body;
  const geminiRes = await generateContent(msg, null);
  if(geminiRes){
    const textData = geminiRes.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(textData)
    console.log(parsed)
    return res.status(200).json({"response": parsed.reply})
  }else{
    return res.status(500).json({"response": "Internal server error"})
  }
});


app.listen(3000, () => console.log("Server running on port 3000"));
