import { getUserNotifications, markNotificationAsRead } from '../repositories/notificationRepository.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.body.authTokenData.id;
    const { limit, cursor } = req.query;

    const limitNum = limit ? parseInt(limit) : 20;

    const notifications = await getUserNotifications(userId, limitNum, cursor);
    
    // Grouped notifications might not have an exact overall _id if there's multiple,
    // but the frontend needs keys. We can map _id if needed, or use notificationIds[0].
    const formatted = notifications.map(n => ({
      ...n,
      _id: n._id === 'grouped' ? n.notificationIds[0] : n._id, // Ensure stable ID for React keys
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
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ message: 'Missing or invalid notificationIds' });
    }

    let modifiedCount = 0;
    for (const id of notificationIds) {
      const result = await markNotificationAsRead(id, userId);
      if (result) modifiedCount++;
    }

    return res.status(200).json({ message: 'Marked as read', count: modifiedCount });
  } catch (error) {
    console.error('markAsRead error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
