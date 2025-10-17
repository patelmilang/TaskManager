import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://task-manager-backend-alpha-olive.vercel.app/',
});

export const fetchTasks = async () => {
  const res = await API.get('/tasks');
  return res.data;
};

export const createTask = async (formData) => {
  return API.post('/tasks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateTask = async (id, payload) => {
  return API.patch(`/tasks/${id}`, payload);
};

export const deleteTask = async (id) => {
  return API.delete(`/tasks/${id}`);
};

export const downloadTaskFile = async (id) => {
  const res = await API.get(`/tasks/${id}/file`, { responseType: 'arraybuffer' });
  return res;
};

export const markTaskAsDone = async (id) => {
  return API.patch(`/tasks/${id}`, { status: 'DONE' });
};
