import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileUploadRoutes from "./fileUpload.js";
import getImagesRoutes from "./getImages.js";
import deleteImagesRoutes from "./deleteImages.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes

app.use("/upload", fileUploadRoutes);   // ✅ only CSV now
app.use("/files", getImagesRoutes);
app.use("/delete", deleteImagesRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
