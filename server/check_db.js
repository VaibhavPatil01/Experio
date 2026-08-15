import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/experio";

const AnalysisSchema = new mongoose.Schema({}, { strict: false });
const Analysis = mongoose.model('ResumeAnalysis', AnalysisSchema, 'resumeanalyses');

async function checkDb() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");
    
    const docs = await Analysis.find().sort({ createdAt: -1 }).limit(1).lean();
    if (docs.length > 0) {
       console.log("LATEST DOC:");
       console.log("ID:", docs[0]._id);
       console.log("Status:", docs[0].status);
       console.log("Result:");
       console.log(JSON.stringify(docs[0].result, null, 2));
    } else {
       console.log("NO DOCS FOUND.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

checkDb();
