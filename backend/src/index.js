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


app.post("/api/getContent", async (req, res) => {
  const { msg } = req.body;
  const userId = generateRandomId();
  const geminiRes = await generateContent(msg, userId);
  if(geminiRes){
    return res.status(200).json({"response": geminiRes.reply})
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


app.listen(3000, () => console.log("Server running on port 3000"));
