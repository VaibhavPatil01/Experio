import axios from 'axios';
import { BASE_API_URL } from './serverConfig';
import { getAuthToken } from '../utils/token/authToken.js';

const apiClient = axios.create({
  baseURL: `${BASE_API_URL}/api/chat/sessions`
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['token'] = token;
  }
  return config;
});

export const fetchSessions = async (page = 1, limit = 20) => {
  const response = await apiClient.get(`/?page=${page}&limit=${limit}`);
  return response.data;
};

export const searchSessions = async (query) => {
  const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const createSession = async (initialPrompt = '') => {
  const response = await apiClient.post('/', { initialPrompt });
  return response.data;
};

export const renameSession = async (sessionId, title) => {
  const response = await apiClient.put(`/${sessionId}/rename`, { title });
  return response.data;
};

export const pinSession = async (sessionId, isPinned) => {
  const response = await apiClient.put(`/${sessionId}/pin`, { isPinned });
  return response.data;
};

export const deleteSession = async (sessionId) => {
  const response = await apiClient.delete(`/${sessionId}`);
  return response.data;
};

export const fetchSessionMessages = async (sessionId, limit = 50, beforeCursor = null) => {
  const url = beforeCursor 
    ? `/${sessionId}/messages?limit=${limit}&beforeCursor=${beforeCursor}`
    : `/${sessionId}/messages?limit=${limit}`;
  const response = await apiClient.get(url);
  return response.data;
};

export const submitFeedback = async (sessionId, messageId, feedback) => {
  const response = await apiClient.post(`/${sessionId}/messages/${messageId}/feedback`, { feedback });
  return response.data;
};
