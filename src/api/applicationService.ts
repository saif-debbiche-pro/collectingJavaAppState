import axios from 'axios';
const API_BASE_URL = 'http://localhost:8081/api/applications'; // Replace with your API base URL
import {Application, ApplicationHistory, Metrics} from '../types/apiTypes'
const apiService = axios.create({
  baseURL: API_BASE_URL,
});



apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(token)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const getAllApps = async () => {
  try {
    const response = await apiService.get<Array<Application>>('');
    console.log("GETTING APPS AGAIN")
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getApp = async (appId:number)=>{
  try {
    const response = await apiService.get<Application>(`/${appId}`);
    console.log(response)
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const addApp = async (app:Application )=>{
  try {
    const response = await apiService.post<Application>(``,app);
    console.log(response)
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const update = async (app:Application,id:string|undefined )=>{
  try {
    const response = await apiService.put<string>(`/${id}`,app,{
      params: {
        action: 'save' // This is your request parameter
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const ValidateUpdate = async (app:Application,id:string|undefined )=>{
  try {
    const response = await apiService.put<string>(`/${id}`,app,{
      params: {
        action: 'validate' 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const reevaluateActions = async (app:Application|undefined,id:string|undefined)=>{
  try {
    const response = await apiService.post<Application>(`/${id}/reevaluate`,app);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getCuurentstate = async (app:Application|undefined,id:string|undefined)=>{
  try {
    const response = await apiService.post<Application>(`/${id}/synchronize`,app);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const getMetrics = async (app:Application|undefined,id:string|undefined)=>{
  try {
    const response = await apiService.get<Metrics>(`/metrics`,{
      params: {
        podName: app?.applicationName,
        namespace:"default" 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteApp = async (id:string|undefined )=>{
  try {
    const response = await apiService.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const getAppHistoryChanges = async (appId:number)=>{
  try {
    const response = await apiService.get<Array<ApplicationHistory>>(`/audit/${appId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

