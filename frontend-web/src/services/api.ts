import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject token into request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auto-refresh token interface if token expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const rToken = localStorage.getItem('refreshToken');
        if (!rToken) throw new Error('No refresh token');

        const { data } = await axios.post('/api/auth/refresh-token', { token: rToken });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export const queryKeys = {
  profile: ['profile'],
  meals: (date: string) => ['meals', date],
  workouts: (date: string) => ['workouts', date],
  progress: ['progress'],
  progressDate: (date: string) => ['progress', date],
  recipes: (category?: string) => ['recipes', category],
  chat: ['chat'],
  grocery: ['grocery'],
  sub: ['subscription']
};
