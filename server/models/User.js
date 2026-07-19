import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, required: true },
  branch: { type: String, required: true },
  passingYear: { type: String, required: true },
  designation: { type: String, required: true },
  about: { type: String, required: true },
  github: { type: String, required: false },
  linkedin: { type: String, required: false },
  phone: { type: String, required: false },
  gender: { type: String, enum: ['Male', 'Female', 'Prefer not to say'], default: 'Prefer not to say' },
  experienceYears: { type: Number, default: 0 },
  experienceMonths: { type: Number, default: 0 },
  location: { type: String, default: "" },
  nationality: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  resume: { 
    url: { type: String, default: "" },
    filename: { type: String, default: "" }
  },
  skills: [{ type: String }],
  socialLinks: [{ type: String }],
  workExperiences: [{
    jobTitle: String,
    company: String,
    startYear: String,
    startMonth: String,
    isCurrentlyWorking: Boolean,
    currency: String,
    currentSalary: String,
    noticePeriod: String,
    industry: String,
    employmentType: String,
    description: String
  }],
  awards: [{
    title: String,
    description: String
  }]
}, {timestamps: true}); 

const User = mongoose.model('User', userSchema);

export default User;


