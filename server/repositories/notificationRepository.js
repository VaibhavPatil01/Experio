import { Notification } from '../models/Notification.js';
import winston from 'winston';

// Optional: you can export the logger or use a central one.
// Assuming central logger is configured, but if not we can use a basic one.
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.validate(); // Ensure Mongoose schema validation passes
    const savedNotification = await notification.save();
    return savedNotification;
  } catch (error) {
    // If it's a duplicate key error on eventId, we can safely ignore/return the existing one
    if (error.code === 11000 && error.keyPattern && error.keyPattern.eventId) {
      logger.info('Duplicate notification event prevented', { eventId: notificationData.eventId });
      // Return the existing notification
      return await Notification.findOne({ eventId: notificationData.eventId });
    }
    logger.error('Failed to create notification', { error: error.message, data: notificationData });
    throw error;
  }
};

export const createNotificationsBatch = async (notificationsDataArray) => {
  try {
    // ordered: false allows continuing insertion even if some documents fail (e.g. duplicate eventIds)
    const result = await Notification.insertMany(notificationsDataArray, { ordered: false });
    return result;
  } catch (error) {
    if (error.code === 11000) {
      // Some duplicates were skipped, this is normal for idempotent batch inserts
      logger.info('Batch notification insert had some duplicate eventIds skipped');
      return error.insertedDocs || [];
    }
    logger.error('Failed to create notification batch', { error: error.message });
    throw error;
  }
};

export const getUserNotifications = async (userId, limit = 20, cursor = null) => {
  try {
    const query = { recipientId: userId };
    
    // Cursor-based pagination: if cursor is provided, fetch older items
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('actorId', 'username profilePic') // Only fetch needed user fields
      .populate('postId', 'title company role');  // Only fetch needed post fields
      
    return notifications;
  } catch (error) {
    logger.error('Failed to fetch user notifications', { error: error.message, userId });
    throw error;
  }
};

export const getUnreadNotificationCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({ recipientId: userId, isRead: false });
    return count;
  } catch (error) {
    logger.error('Failed to get unread notification count', { error: error.message, userId });
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );
    return updated;
  } catch (error) {
    logger.error('Failed to mark notification as read', { error: error.message, notificationId });
    throw error;
  }
};

export const markMultipleNotificationsAsRead = async (notificationIds, userId) => {
  try {
    const result = await Notification.updateMany(
      { _id: { $in: notificationIds }, recipientId: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    return result;
  } catch (error) {
    logger.error('Failed to mark multiple notifications as read', { error: error.message, userId });
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    return result;
  } catch (error) {
    logger.error('Failed to mark all notifications as read', { error: error.message, userId });
    throw error;
  }
};
