// saveReport.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserReports from "../models/fileData.js";
import extractStructuredPDF from "../getDataFromFile/getData.js";

dotenv.config();

export default async function saveReport(filePath, userId) {
  try {
    // extract structured data
    const newReportData = await extractStructuredPDF(filePath);

    // 2. Find the single document corresponding to the userId
    let userDocument = await UserReports.findOne({ userId });

    if (!userDocument) {
      // 3a. If the user's document doesn't exist, create a new one.
      // The `reports` field will be an array containing this first report.
      userDocument = new UserReports({
        userId: userId,
        reports: [newReportData] 
      });
      console.log("✅ New user document created. Saving first report...");

    } else {
      // 3b. If the document already exists, push the new report into the `reports` array.
      userDocument.reports.push(newReportData);
      console.log("✅ Existing user document found. Adding new report...");
    }

    // 4. Save the document (either new or updated)
    await userDocument.save();
    console.log("✅ Report updated successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    mongoose.connection.close();
  }
}
