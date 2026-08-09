import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import isUserAuth from '../middleware/isUserAuth.js';

const notificationRouter = express.Router();

notificationRouter.get('/', isUserAuth, getNotifications);
notificationRouter.patch('/read', isUserAuth, markAsRead);

export default notificationRouter;
