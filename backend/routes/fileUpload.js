// src/fileUpload.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { extractFromCSV } from "../utils/extractor.js";
import { generateInsights } from "../utils/insightGenerator.js";
import UserFile from "../models/file.js";
import saveReport from "../mongoDB/fileDataDB.js";
import fs from "fs"

dotenv.config();
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads"; // create uploads folder if not exists
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /upload (CSV, PDF, or Images)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const userId = req.body.userId;
    const filePath = req.file.path;
    console.log(`[LOG] Received file: ${req.file.originalname}`);

    const ext = path.extname(req.file.originalname).toLowerCase();
    // ✅ 1. Add image extensions to the allowed list
    const allowedExtensions = [".csv", ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp"];
    
    console.log(`[LOG] Detected file extension: ${ext}`);

    if (!allowedExtensions.includes(ext)) {
      console.error(`[ERROR] Invalid file type: ${ext}`);
      return res
        .status(400)
        .json({ error: "Only CSV, PDF, and image files are supported" });
    }

    let extracted = null;
    let insights = null;

    if (ext === ".csv") {
      console.log("[LOG] File is a CSV. Starting extraction and insight generation...");
      try {
        extracted = await extractFromCSV(req.file.buffer);
        insights = generateInsights({
          type: "csv",
          data: extracted,
          fileName: req.file.originalname,
        });
        console.log("[LOG] CSV processing complete.");
      } catch (exErr) {
        console.error("CSV extraction error:", exErr);
        return res.status(500).json({ error: "Failed to process CSV file", message: exErr.message });
      }
    } else {
        // ✅ 2. Generic log for any non-CSV file (PDF, images)
        console.log(`[LOG] File is a non-CSV (${ext}). Skipping extraction.`);
    }

    console.log("[LOG] Starting upload to Cloudinary...");
    cloudinary.uploader.upload(
      filePath,
      { resource_type: "auto", folder: "biojourney_docs" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Cloudinary upload failed", message: error.message });
        }

        console.log(`[LOG] Successfully uploaded to Cloudinary. URL: ${result.secure_url}`);

        let user = await UserFile.findOne({ userId });
        if (!user) {
          const newUser = new UserFile({
            userId, // ✅ must set userId
            files: [
              {
                originalName: req.file.originalname,
                publicId: result.public_id,
                url: result.secure_url,
              }
            ]
          });
          await newUser.save();
        } else {
          user.files.push({
            originalName: req.file.originalname,
            publicId: result.public_id,
            url: result.secure_url,
          });
          await user.save();
        }


        // generating insight and saving in DB
        console.log(filePath);
        await saveReport(filePath, userId);
        console.log("insight generated");

        res.json({
          status: "success",
          url: result.secure_url,
          public_id: result.public_id,
          extracted,
          insights,
        });
      }
    );

    
  } catch (err)
  {
    console.error("Upload error:", err);
    // ✅ 3. Send back a more detailed error message
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

export default router;