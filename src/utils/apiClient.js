import { API_BASE_URL } from '../config/api.js';

const getAuthToken = () => localStorage.getItem('authToken');

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: 'Invalid response' };
  }

  console.log(`[API Response] ${response.status}`, data);

  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const apiClient = {
  get: async (endpoint) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`[API POST] ${endpoint}`, body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    return handleResponse(response);
  },
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};
