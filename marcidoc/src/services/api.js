// src/services/api.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ Remplace par l'URL de ton backend FastAPI
const BASE_URL = 'https://api.marcidoc.ga/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Injecte le token JWT à chaque requête
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gestion globale des erreurs
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      SecureStore.deleteItemAsync('token');
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  register: (data) =>
    api.post('/auth/register', data),
  me: () =>
    api.get('/auth/me'),
};

// ── DOSSIER MÉDICAL ───────────────────────────────────
export const dossierAPI = {
  get: () =>
    api.get('/dossier'),
  update: (data) =>
    api.patch('/dossier', data),
  getAntecedents: () =>
    api.get('/dossier/antecedents'),
  addAntecedent: (data) =>
    api.post('/dossier/antecedents', data),
};

// ── EXAMENS ───────────────────────────────────────────
export const examensAPI = {
  list: (type = null) =>
    api.get('/examens', { params: type ? { type } : {} }),
  getById: (id) =>
    api.get(`/examens/${id}`),
  upload: (formData) =>
    api.post('/examens', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getPdf: (id) =>
    api.get(`/examens/${id}/pdf`, { responseType: 'blob' }),
};

// ── MÉDICAMENTS ───────────────────────────────────────
export const medicamentsAPI = {
  list: () =>
    api.get('/medicaments'),
  search: (query) =>
    api.get('/medicaments/search', { params: { q: query } }),
  getOrdonnances: () =>
    api.get('/medicaments/ordonnances'),
  getPharmacies: (lat, lng) =>
    api.get('/pharmacies/proches', { params: { lat, lng } }),
};

export default api;
