import { Notification } from '../models/Notification.js';
import mongoose from 'mongoose';
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

export const getUserNotifications = async (userId, limit = 20, cursor = null, unreadOnly = false) => {
  try {
    const matchQuery = { recipientId: new mongoose.Types.ObjectId(userId) };
    
    if (unreadOnly) {
      matchQuery.isRead = false;
    }
    
    // Cursor-based pagination: if cursor is provided, fetch older items
    if (cursor) {
      matchQuery.createdAt = { $lt: new Date(cursor) };
    }

    const notifications = await Notification.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      {
        // Group by combination of type, post, and read status for social actions.
        // E.g., multiple unread likes on the same post are grouped.
        // For non-groupable actions (like POST_MATCH), we group by the unique _id so they stay separate.
        $group: {
          _id: {
            $cond: [
              { $in: ["$type", ["POST_LIKE", "POST_COMMENT"]] },
              { type: "$type", postId: "$postId", isRead: "$isRead" }, // Group key
              "$_id" // Non-group key (unique)
            ]
          },
          latestCreatedAt: { $first: "$createdAt" },
          notificationIds: { $push: "$_id" },
          actors: { $addToSet: "$actorId" },
          type: { $first: "$type" },
          isRead: { $first: "$isRead" },
          entityType: { $first: "$entityType" },
          entityId: { $first: "$entityId" },
          postId: { $first: "$postId" },
          commentId: { $first: "$commentId" },
          parentCommentId: { $first: "$parentCommentId" },
          similarityScore: { $first: "$similarityScore" },
          metadata: { $first: "$metadata" }
        }
      },
      { $sort: { latestCreatedAt: -1 } },
      { $limit: limit }
    ]);

    // Populate the grouped results
    const populated = await Notification.populate(notifications, [
      { path: 'actors', select: 'username profilePic', model: 'User' },
      { path: 'postId', select: 'title company role', model: 'Post' }
    ]);

    // Reformat slightly to match frontend expectations (putting actor at root if count is 1 for legacy support)
    return populated.map(n => {
      n.actorId = n.actors.length > 0 ? n.actors[0] : null;
      n.groupCount = n.actors.length;
      return n;
    });
    
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


