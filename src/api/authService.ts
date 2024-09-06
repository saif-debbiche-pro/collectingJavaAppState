import axios from 'axios';
const API_BASE_URL = 'http://localhost:8081'; // Replace with your API base URL



// /user/me
import { ResponseLogin } from '../types/loginResponse';
const apiService = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async (email:String,password:String) => {
  try {
    const response = await apiService.post<ResponseLogin>('/login',{email,password});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isTokenValid = async (token:string|null) => {
  if(token==null) return null;
  try {
    const response = await apiService.get<ResponseLogin>('/user/me',{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};