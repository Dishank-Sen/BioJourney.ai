import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import generateContent from "../gemini/generateContent.js";
import cron from "node-cron"
import startShifting from "../workers/signaling.js";
import connectDB from "../mongoDB/connect.js";
import test from "../mongoDB/test.js";
import generateRandomId from "../utils/generateId.js";
import { seedDatabase } from "../mongoDB/seed.js";
import getTimelineData from "../dataRetrieveMongoDB/timelineData.js";
import formatBioProfile from "../utils/formatBioProfile.js";
import getConversationCount from "../dataRetrieveMongoDB/conversationCount.js" 
import getFullConversation from "../dataRetrieveMongoDB/getFullConversation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

await connectDB();
// await seedDatabase();
// await testSave();
// console.log(process.env.MONGODB_URI)

app.use(cors());
app.use(express.json());

cron.schedule("0 0 * * *", async () => {
  console.log("Running task at midnight...");
  await startShifting("tier1-to-tier2");
  await startShifting("tier2-to-tier3");
  await startShifting("tier3-to-tier4");
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong 🏓 from backend" });
});

app.get("/test", (req, res) => {
  res.json({ message: "test message" });
});

app.post("/api/getContent", async (req, res) => {
  const { msg, userId } = req.body;
  const geminiRes = await generateContent(msg, userId);
  if(geminiRes){
    return res.status(200).json({"response": geminiRes.reply, "persona": geminiRes.persona})
  }else{
    return res.status(500).json({"response": "Internal server error"})
  }
});

app.get("/seed", async (req, res) => {
  try {
    console.log("inside seed..");
    await test();
    return res.json({ message: "saved" });
  } catch (error) {
    console.error("error seed:", error);
    return res.status(500).json({ message: "error saving", error: error.message });
  }
});

app.post("/api/timeline", async (req,res) => {
  try {
    const { userId } = req.body;
    const timelineDataRetrived =  await getTimelineData(userId);
    return res.status(200).json({"message": timelineDataRetrived})
  } catch (error) {
    console.log("timeLine error: ",error)
  }
})

app.get("/formatData", async (req,res) => {
  const formatData = await formatBioProfile("68a1ca9892c8c177a63ee0d0", "carla")
  console.log("formatted data:", formatData)
})

app.post("/api/getConversationCount", async (req,res) => {
  const {userId} = req.body;
  const convoCount = await getConversationCount(userId);
  // console.log(convoCount)
  return res.status(200).json({count: convoCount.count, totalCount: convoCount.totalCount})
})

app.post("/api/getConversation", async (req, res) => {
  const {userId} = req.body;
  const userConversation = await getFullConversation(userId)
  // console.log(userConversation)
  return res.status(200).json({"conversation": userConversation})
})

app.listen(3000, '0.0.0.0',() => console.log("Server running on port 3000"));
