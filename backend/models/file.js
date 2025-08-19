import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    publicId: { type: String, required: true }, 
    url: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const savedFileSchema = new mongoose.Schema(
    {
        userId: String,
        files: [fileSchema]
    }
)

export default mongoose.model("UserFile", savedFileSchema);
