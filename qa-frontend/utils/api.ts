import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-flask-backend-url',
  withCredentials: true, // Ensure cookies are sent
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post('/register', { email, password });
  return response.data;
};

export const fetchMe = async () => {
  const response = await api.get('/whoami');
  return response.data;
};
