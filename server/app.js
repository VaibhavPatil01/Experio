import cors from 'cors';
import path from 'path';
import express from 'express';
import './configs/passport.js';
import passport from 'passport';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import postRouter from './modules/posts/routes/postRoutes.js';
import userRouter from './modules/users/routes/userRoutes.js';
import corsOptions from './configs/corsConfig.js';

import { httpLogger } from './middlewares/httpLogger.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import notificationRouter from './modules/posts/routes/notificationRoutes.js';
import recommendationRouter from './modules/posts/routes/recommendationRoutes.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import chatSessionRoutes from './modules/chat/routes/chatSessionRoutes.js';
import analyzerRoutes from './modules/resumeAnalyzer/routes/analyzerRoutes.js';

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

// Home Route
app.get('/', (req, res) => {
  res.status(200).json({ name: 'Experio API' });
});

// API Routes
app.use('/user', userRouter);
app.use('/posts', globalLimiter, postRouter);

app.use('/api/notifications', notificationRouter);
app.use('/recommendations', recommendationRouter);
app.use('/api/chat/sessions', chatSessionRoutes);
app.use('/api/resume-analyzer', analyzerRoutes);

// Global Error Handler must be the last middleware
app.use(globalErrorHandler);

export default app;
