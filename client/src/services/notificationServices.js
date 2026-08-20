import apiClient from './apiClient';

export const fetchNotifications = (limit = 20, cursor = null, unreadOnly = false, category = 'All') => {
  let query = `?limit=${limit}&unreadOnly=${unreadOnly}&category=${category}`;
  if (cursor) query += `&cursor=${cursor}`;
  return apiClient.get(`/api/notifications/${query}`);
};

export const fetchUnreadCount = () => {
  return apiClient.get('/api/notifications/unread-count');
};

export const markNotificationRead = (id, notificationIds = null) => {
  if (notificationIds && notificationIds.length > 0) {
    return apiClient.patch('/api/notifications/batch/read', { notificationIds });
  }
  return apiClient.patch(`/api/notifications/${id}/read`);
};

export const markAllNotificationsRead = () => {
  return apiClient.patch('/api/notifications/read-all');
};

export const deleteNotification = (id) => {
  return apiClient.delete(`/api/notifications/${id}`);
};
