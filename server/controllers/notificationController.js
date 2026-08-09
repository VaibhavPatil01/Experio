import { getUserNotifications, markNotificationAsRead, getUnreadNotificationCount, markAllNotificationsAsRead, markMultipleNotificationsAsRead } from '../repositories/notificationRepository.js';
import { emitNotificationRead, emitNotificationReadAll } from '../configs/socket.js';
import { Notification } from '../models/Notification.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

export const getNotifications = async (req, res) => {
  try {
    const userId = req.body.authTokenData.id;
    const { limit, cursor, unreadOnly, category } = req.query;

    const limitNum = limit ? parseInt(limit) : 20;
    const isUnreadOnly = unreadOnly === 'true';

    const notifications = await getUserNotifications(userId, limitNum, cursor, isUnreadOnly, category);
    
    // Grouped notifications have an object _id. The frontend needs a stable string key.
    const formatted = notifications.map(n => ({
      ...n,
      _id: (typeof n._id === 'object' && n.notificationIds) ? n.notificationIds.join('_') : n._id, 
    }));

    return res.status(200).json({ notifications: formatted });
  } catch (error) {
    console.error('getNotifications error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.body.authTokenData.id;
    // The frontend can pass an array of IDs if it's grouped
    const { notificationIds } = req.body; // legacy batch support
    const singleId = req.params.id;

    if (singleId && singleId !== 'batch') {
      const result = await markNotificationAsRead(singleId, userId);
      if (result) {
        emitNotificationRead(userId, singleId);
        logger.info(`[NotificationController] Notification marked as read`, {
          event: 'NOTIFICATION_READ',
          notificationId: singleId,
          userId
        });
      }
      return res.status(200).json({ message: 'Marked as read', count: result ? 1 : 0 });
    }

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ message: 'Missing or invalid notificationIds' });
    }

    const result = await markMultipleNotificationsAsRead(notificationIds, userId);
    
    // For legacy batch arrays, loop over the original list and emit individually, or add a batch emit.
    // Given the prompt, emitNotificationRead for each or let frontend refetch. 
    // Emitting individually is fine.
    if (result.modifiedCount > 0) {
      for (const id of notificationIds) {
        emitNotificationRead(userId, id);
      }
      logger.info(`[NotificationController] Notifications marked as read`, {
        event: 'NOTIFICATION_READ',
        count: result.modifiedCount,
        userId
      });
    }

    return res.status(200).json({ message: 'Marked as read', count: result.modifiedCount });
  } catch (error) {
    console.error('markAsRead error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.body.authTokenData.id;
    const count = await getUnreadNotificationCount(userId);
    return res.status(200).json({ count });
  } catch (error) {
    console.error('getUnreadCount error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const userId = req.body.authTokenData.id;
    const result = await markAllNotificationsAsRead(userId);
    if (result.modifiedCount > 0) {
      emitNotificationReadAll(userId);
      logger.info(`[NotificationController] All notifications marked as read`, {
        event: 'NOTIFICATION_READ_ALL',
        count: result.modifiedCount,
        userId
      });
    }
    return res.status(200).json({ message: 'All notifications marked as read', count: result.modifiedCount });
  } catch (error) {
    console.error('markAllRead error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.body.authTokenData.id;
    const { id } = req.params;

    const result = await Notification.findOneAndDelete({ _id: id, recipientId: userId });
    
    if (!result) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('deleteNotification error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
