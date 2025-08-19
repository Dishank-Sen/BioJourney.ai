// src/files.js
import express from "express";
import UserFile from "../models/file.js";

const router = express.Router();

// GET /files → list uploaded files for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserFile.findOne({ userId });
    if (!user || !user.files.length) {
      return res.json([]);
    }

    res.json(
      user.files.map((file) => ({
        url: file.url,
        public_id: file.publicId,
        originalName: file.originalName,
      }))
    );
  } catch (err) {
    console.error("Get files error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

export default router;
