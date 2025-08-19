// src/fileUpload.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { extractFromCSV } from "../utils/extractor.js";
import { generateInsights } from "../utils/insightGenerator.js";

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /upload (CSV or PDF)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Added more descriptive logs
    console.log(`[LOG] Received file: ${req.file.originalname}`);

    const ext = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = [".csv", ".pdf"];
    
    console.log(`[LOG] Detected file extension: ${ext}`);

    if (!allowedExtensions.includes(ext)) {
      console.error(`[ERROR] Invalid file type: ${ext}`);
      return res
        .status(400)
        .json({ error: "Only CSV and PDF files are supported" });
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
        return res.status(500).json({ error: "Failed to process CSV file" });
      }
    } else if (ext === ".pdf") {
      console.log("[LOG] File is a PDF. Skipping extraction.");
    }

    console.log("[LOG] Starting upload to Cloudinary...");
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "biojourney_docs" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }
        
        // ✅ This log confirms the upload is finished for both file types
        console.log(`[LOG] Successfully uploaded to Cloudinary. URL: ${result.secure_url}`);
        
        res.json({
          status: "success",
          url: result.secure_url,
          public_id: result.public_id,
          extracted, // Will be null for PDFs
          insights,  // Will be null for PDFs
        });
      }
    );
    stream.end(req.file.buffer);
    
  } catch (err)
  {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;