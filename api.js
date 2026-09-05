import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me'),
}

export const photoAPI = {
  generate: (formData) => api.post('/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => api.get('/photos'),
  delete: (id) => api.delete(`/photos/${id}`),
  download: (id) => api.post(`/photos/${id}/download`),
}

export const creditAPI = {
  getBalance: () => api.get('/credits'),
  buy: (amount, plan) => api.post('/credits/buy', { amount, plan }),
}

export const statsAPI = {
  getStats: () => api.get('/stats'),
}

export default api
