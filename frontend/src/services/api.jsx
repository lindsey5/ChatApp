import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://localhost:5050';

export const fetchData = async (endpoint) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data
  }
};

export const postData = async (endpoint, data) => {
  try {
     const token = getToken();
    const response = await axios.post(`${API_URL}${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return error.response
  }
};

export const updateData = async (endpoint, data) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return error.response.data
  }
};