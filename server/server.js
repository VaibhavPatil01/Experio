// Load environment variables automatically (shorthand)
import 'dotenv/config';

// Import necessary modules
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';

import './configs/passport.js';
import connectDB from './configs/db.js';
import { initQdrant } from './configs/qdrant.js';
import { initSocket } from './configs/socket.js';
import { initEmbeddingSyncWorker } from './workers/embeddingSyncWorker.js';
import { initNotificationWorker } from './workers/notificationWorker.js';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import recommendationRouter from './routes/recommendationRoutes.js';
import chatSessionRoutes from './modules/chat/routes/chatSessionRoutes.js';
import analyzerRoutes from './modules/resumeAnalyzer/routes/analyzerRoutes.js';
import preventServerSleep from './utils/preventServerSleep.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { httpLogger } from './middlewares/httpLogger.js';
import { globalLimiter } from './middlewares/rateLimiter.js';

import Sentiment from 'sentiment';

// --------------------- Connect to MongoDB ---------------------
await connectDB();

// --------------------- Express App ---------------------
const app = express();

// --------------------- CORS ---------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://interview-experience-gsmcoe.vercel.app",
  "https://interview-experience-gsmcoe.onrender.com",
  "https://experio-beryl.vercel.app",
  "https://experio-mll8.onrender.com"

];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// --------------------- Middlewares ---------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(httpLogger);
app.use('/api', globalLimiter); // Apply global limit to all APIs

// --------------------- Static Files ---------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// --------------------- Test Route ---------------------
app.post('/test-sentiment', (req, res) => {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(req.body.content || "");
  const sentimentLabel =
    result.score > 0 ? "positive" : result.score < 0 ? "negative" : "neutral";

  res.json({
    score: result.score,
    comparative: result.comparative,
    sentiment: sentimentLabel,
    words: result.words,
  });
});

// --------------------- API Routes ---------------------
app.use('/user', userRouter);
app.use('/posts', globalLimiter, postRouter);
app.use('/comments', globalLimiter, commentRouter);
app.use('/api/notifications', notificationRouter);
app.use('/recommendations', recommendationRouter);
app.use('/api/chat/sessions', chatSessionRoutes);
app.use('/api/resume-analyzer', analyzerRoutes);

// --------------------- Home Route ---------------------
app.get('/', (req, res) => {
  res.status(200).json({ name: 'Experio API' });
});

// --------------------- Start Server ---------------------
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`✅ Server is running on PORT ${PORT}`);

  // Initialize WebSockets
  initSocket(server);
  console.log('✅ Socket.io Initialized');

  // Initialize AI Knowledge Layer
  await initQdrant();

  console.log('[Workers] Init sync queue worker...');
  initEmbeddingSyncWorker();

  console.log('[Workers] Init notification queue worker...');
  initNotificationWorker();
  console.log('✅ AI Knowledge Layer Initialized');

  preventServerSleep(); // Schedule background task
});

app.use(globalErrorHandler);

export default app;
