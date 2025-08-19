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
import fileUploadRoutes from "../routes/fileUpload.js";
import getImagesRoutes from "../routes/getImages.js";
import deleteImagesRoutes from "../routes/deleteImages.js";
import UserReports from "../models/fileData.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

await connectDB();
// await seedDatabase();
// await testSave();
// console.log(process.env.MONGODB_URI)

app.use(cors({
  origin: "https://biojourney.dsxdev.me",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
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

app.get("/test1", (req, res) => {
  res.json({ message: "test message 1" });
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

app.post("/api/reports", async (req,res) => {
  try {
    const { userId } = req.body;
    
    // 1. Find the single document for the user
    const userDocument = await UserReports.findOne({ userId });
    console.log(userDocument)
    // 2. If no document or no reports exist, return an empty array as the frontend expects
    if (!userDocument || !userDocument.reports || userDocument.reports.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Map the reports from the document to the desired response format
    const formattedReports = userDocument.reports.map(report => ({
      timestamp: report.createdAt, // Each report sub-document has its own `createdAt`
      patient: report.patient,
      sections: report.sections,
      findings: report.findings,
      recommendations: report.recommendations,
    }))
    // Optional: Sort reports by date, newest first, before sending
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); 

    // 4. Send the array of reports
    res.status(200).json(formattedReports);

  } catch (error) {
    console.error('Error fetching medical reports:', error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
})

app.use("/api/upload", fileUploadRoutes);   // ✅ only CSV now
app.use("/api/files", getImagesRoutes);
app.use("/api/delete", deleteImagesRoutes);

app.listen(3000, '0.0.0.0',() => console.log("Server running on port 3000"));
