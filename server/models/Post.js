import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const commentSchema = new mongoose.Schema({ 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  replies: [replySchema],
}, { timestamps: true }); 

const roundSchema = new mongoose.Schema({
  roundType: { type: String, required: true },
  duration: { type: String, required: false },
  difficulty: { type: String, required: false },
  topicsCovered: [{ type: String }],
  questionsAsked: [{ type: String, required: true }],
  experienceAndTips: { type: String, required: true },
  isMostImportant: { type: Boolean, default: false }
});

const postSchema = new mongoose.Schema({  
  title: { type: String, required: false },
  content: { type: String, required: false },
  summary: { type: String, required: false, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  company: { type: String, required: true },
  role: { type: String, required: true },
  postType: { type: String, required: false }, 
  domain: { type: String, required: false },
  rating: { type: Number, required: false },
  status: { type: String, required: true },
  upVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  bookmarks: [mongoose.Schema.Types.ObjectId],
  tags: [String],
  comments: [commentSchema],
  
  // New Fields
  hiringType: { type: String, required: false },
  interviewMode: { type: String, required: false },
  interviewDate: { type: String, required: false },
  result: { type: String, required: false },
  salary: {
    base: { type: String, required: false },
    bonus: { type: String, required: false },
    stocks: { type: String, required: false },
    totalCTC: { type: String, required: false },
    currency: { type: String, default: 'INR' }
  },
  rounds: [roundSchema],
  technologies: [{ type: String }],
  dsaTopics: [{ type: String }],
  coreSubjects: [{ type: String }],
  preparationDuration: { type: String, required: false },
  preparationResources: { type: String, required: false },
  overallTips: { type: String, required: false },
  isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

export const Reply = mongoose.model('Reply', replySchema);
export const Comment = mongoose.model('Comment', commentSchema);
export const Post = mongoose.model('Post', postSchema);