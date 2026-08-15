import express from 'express';
import { getNotifications, markAsRead, getUnreadCount, markAllRead, deleteNotification } from '../controllers/notificationController.js';
import isUserAuth from '../middleware/isUserAuth.js';

const notificationRouter = express.Router();

notificationRouter.get('/', isUserAuth, getNotifications);
notificationRouter.get('/unread-count', isUserAuth, getUnreadCount);
notificationRouter.patch('/read-all', isUserAuth, markAllRead);
notificationRouter.patch('/:id/read', isUserAuth, markAsRead);
notificationRouter.delete('/:id', isUserAuth, deleteNotification);

export default notificationRouter;
