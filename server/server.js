import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import express from 'express';
import './configs/passport.js';
import passport from 'passport';
import { fileURLToPath } from 'url';
import connectDB from './configs/db.js';
import cookieParser from 'cookie-parser';
import postRouter from './routes/postRoutes.js';
import userRouter from './routes/userRoutes.js';
import { initQdrant } from './configs/qdrant.js';
import { initSocket } from './configs/socket.js';
import corsOptions from './configs/corsConfig.js';
import commentRouter from './routes/commentRoutes.js';
import { httpLogger } from './middlewares/httpLogger.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import preventServerSleep from './utils/preventServerSleep.js';
import notificationRouter from './routes/notificationRoutes.js';
import recommendationRouter from './routes/recommendationRoutes.js';
import { initNotificationWorker } from './workers/notificationWorker.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { initEmbeddingSyncWorker } from './workers/embeddingSyncWorker.js';
import chatSessionRoutes from './modules/chat/routes/chatSessionRoutes.js';
import analyzerRoutes from './modules/resumeAnalyzer/routes/analyzerRoutes.js';

// Connect to MongoDB
await connectDB();

// Express App
const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(httpLogger);
app.use('/api', globalLimiter); // Apply global limit to all APIs

// Static Files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));


// --------------------- API Routes ---------------------
app.use('/user', userRouter);
app.use('/posts', globalLimiter, postRouter);
app.use('/comments', globalLimiter, commentRouter);
app.use('/api/notifications', notificationRouter);
app.use('/recommendations', recommendationRouter);
app.use('/api/chat/sessions', chatSessionRoutes);
app.use('/api/resume-analyzer', analyzerRoutes);

// Home Route
app.get('/', (req, res) => {
  res.status(200).json({ name: 'Experio API' });
});

// Start Server
async function startServer() {
  try {
    // 1. Initialize Databases & Third-Party Services FIRST
    await connectDB();
    await initQdrant();
    console.log('✅ AI Knowledge Layer Initialized');
    // 2. Initialize Background Workers
    initEmbeddingSyncWorker();
    initNotificationWorker();
    preventServerSleep();
    // 3. Start the HTTP Server LAST (Only when everything else is ready)
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on PORT ${PORT}`);
    });
    // 4. Attach WebSockets to the running server
    initSocket(server);
    console.log('✅ Socket.io Initialized');
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Exit strictly if dependencies fail
  }
}

startServer();

app.use(globalErrorHandler);

export default app;
