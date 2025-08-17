import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { extractFromCSV, extractFromPDF, extractFromImage } from "./utils/extractor.js";

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ext = path.extname(req.file.originalname).toLowerCase();
    let extracted = "";

    try {
      if (ext === ".csv") {
        extracted = await extractFromCSV(req.file.buffer);
      } else if (ext === ".pdf") {
        extracted = await extractFromPDF(req.file.buffer);
      } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        // Save temp file for Vision API
        const tempPath = `temp_${Date.now()}${ext}`;
        fs.writeFileSync(tempPath, req.file.buffer);
        extracted = await extractFromImage(tempPath);
        fs.unlinkSync(tempPath); // cleanup
      }
    } catch (exErr) {
      console.error("Extraction error:", exErr);
    }

    // Upload file to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "biojourney_docs" },
      (error, result) => {
        if (error) return res.status(500).json({ error: "Cloudinary upload failed" });
        res.json({
          status: "success",
          url: result.secure_url,
          public_id: result.public_id,
          extracted,
        });
      }
    );
    stream.end(req.file.buffer);

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
