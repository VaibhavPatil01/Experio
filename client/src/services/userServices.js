import apiClient from './apiClient.js';
import { BASE_API_URL } from './serverConfig.js';

export function getUserStatus() {
  const url = `${BASE_API_URL}/user/status`;
  return apiClient.get(url).then((response) => response.data);
}

export function registerUser(user) {
  const url = `${BASE_API_URL}/user/register`;
  return apiClient.post(url, user).then((response) => response.data);
}

export function loginUser(email, password) {
  const url = `${BASE_API_URL}/user/login`;
  const user = { email, password };
  return apiClient.post(url, user).then((response) => response.data);
}

export function logoutUser() {
  const url = `${BASE_API_URL}/user/logout`;
  return apiClient.post(url, {}).then((response) => response.data);
}

export function sendForgotPasswordMail(email) {
  const url = `${BASE_API_URL}/user/forgot-password`;
  const body = { email };
  return apiClient.post(url, body).then((response) => response.data);
}

export function resetUserPassword(email, password, token) {
  const url = `${BASE_API_URL}/user/reset-password/${token}`;
  const body = { email, password };
  return apiClient.post(url, body).then((response) => response.data);
}

export function getUserProfileStats(userId) {
  const url = `${BASE_API_URL}/user/profile/${userId}`;
  return apiClient.get(url).then((response) => response.data.data[0]);
}

export function updateUser(user) {
  const url = `${BASE_API_URL}/user/profile`;
  return apiClient.put(url, user).then((response) => response.data);
}

export function uploadResumeFile(formData) {
  const url = `${BASE_API_URL}/user/resume`;
  return apiClient.put(url, formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  }).then((response) => response.data);
}

export function uploadProfilePicture(formData) {
  const url = `${BASE_API_URL}/user/profile-picture`;
  return apiClient.put(url, formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  }).then((response) => response.data);
}

export function searchUser(user, page, limit, signal) {
  const url = new URL(`${BASE_API_URL}/user/search`);
  url.searchParams.set('searchparam', user);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());

  return apiClient.get(url.href, { signal }).then((res) => res.data);
}
