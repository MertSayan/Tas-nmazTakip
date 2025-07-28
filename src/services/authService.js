import axios from 'axios';

const API_URL = 'https://localhost:7104/api/Users/Login'; // Buraya senin API'nin doğru endpointi gelecek

export const login = async (email, password) => {
  const response = await axios.post(API_URL, {
    email,
    password
  });
  return response.data; // Token dönecektir
};