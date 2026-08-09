import axios from 'axios';
import { BASE_API_URL } from './serverConfig';

import getAuthToken from '../utils/getAuthToken';

const API = axios.create({
  baseURL: `${BASE_API_URL}/api/notifications`,
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = getAuthToken();
  if (token) {
    req.headers['token'] = token;
  }
  return req;
});

export const fetchNotifications = (limit = 20, cursor = null, unreadOnly = false) => {
  let query = `?limit=${limit}&unreadOnly=${unreadOnly}`;
  if (cursor) query += `&cursor=${cursor}`;
  return API.get(`/${query}`);
};

export const fetchUnreadCount = () => {
  return API.get('/unread-count');
};

export const markNotificationRead = (id) => {
  return API.patch(`/${id}/read`);
};

export const markAllNotificationsRead = () => {
  return API.patch('/read-all');
};

export const deleteNotification = (id) => {
  return API.delete(`/${id}`);
};
