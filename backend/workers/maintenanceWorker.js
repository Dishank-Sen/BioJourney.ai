import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import tier1ToTier2 from '../data_shifting/tier1_to_tier2.js';
import tier2ToTier3 from '../data_shifting/tier2_to_tier3.js';
import tier3ToTier4 from '../data_shifting/tier3_to_tier4.js';

const connection = new IORedis({ maxRetriesPerRequest: null });

console.log("Worker is listening for jobs...");

new Worker('tier-maintenance-queue', async (job) => {
  console.log("inside worker!")
  if (job.name === 'tier1-to-tier2') {
    console.log("Processing 'tier1-to-tier2' job...");
    try {
      await tier1ToTier2();
      console.log("Job completed successfully.");
    } catch (error) {
      console.error("Job failed:", error);
      throw error;
    }
  }else if(job.name === 'tier2-to-tier3'){
    console.log("Processing 'tier2-to-tier3' job...");
    try {
      await tier2ToTier3();
      console.log("Job completed successfully.");
    } catch (error) {
      console.error("Job failed:", error);
      throw error;
    }
  }else if(job.name === 'tier3-to-tier4'){
    console.log("Processing 'tier3-to-tier4' job...");
    try {
      await tier3ToTier4();
      console.log("Job completed successfully.");
    } catch (error) {
      console.error("Job failed:", error);
      throw error;
    }
  }
}, { connection });