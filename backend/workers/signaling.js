import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({ maxRetriesPerRequest: null });
const maintenanceQueue = new Queue('tier-maintenance-queue', { connection });

export default async function startShifting(shift) {
  await maintenanceQueue.add(shift, {});
  console.log(`Added ${shift} job to the queue.`);
}