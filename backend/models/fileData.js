import mongoose from "mongoose";

// Sub-schema for individual sections like "Blood Pressure"
const SectionSchema = new mongoose.Schema({
  section_name: { type: String },
  observations: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { _id: false }); // No separate _id for sections

// Sub-schema for a single, complete medical report
const ReportDataSchema = new mongoose.Schema({
  patient: {
    name: { type: String, default: null },
    age: { type: Number, default: null },
    sex: { type: String, default: null },
  },
  report_metadata: {
    report_title: { type: String, default: null },
    date: { type: String, default: null },
    physician: { type: String, default: null },
    institution: { type: String, default: null }
  },
  sections: [SectionSchema],
  findings: [{ type: String }],
  recommendations: [{ type: String }]
}, { 
  timestamps: true // Adds `createdAt` and `updatedAt` to each individual report
});

// Main schema: One document per user, containing an array of their reports
const UserReportsSchema = new mongoose.Schema({
  userId: { 
    type: String,  
    required: true,
    unique: true // Ensures one document per user
  },
  reports: [ReportDataSchema] // An array of report data
});

export default mongoose.model("UserReports", UserReportsSchema);