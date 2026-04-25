import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const Job = (await import('../src/models/Job.model.js')).default;

async function testUpdate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const job = await Job.findOne();
    if (!job) {
      console.log('No job found');
      return;
    }

    console.log('Original Date Saved:', job.dateSaved);
    
    const newDate = new Date('2026-05-20');
    job.dateSaved = newDate;
    await job.save();

    const updatedJob = await Job.findById(job._id);
    console.log('Updated Date Saved:', updatedJob.dateSaved);
    
    if (updatedJob.dateSaved.toISOString().startsWith('2026-05-20')) {
      console.log('SUCCESS: Date updated correctly in MongoDB');
    } else {
      console.log('FAILURE: Date did not update correctly');
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

testUpdate();
