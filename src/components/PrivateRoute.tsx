import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenValid } from '../api/authService';
// Function to get the access token from cookies
const getAccessToken = () => {
  console.log(localStorage.getItem('accessToken'))

  return localStorage.getItem('accessToken');
}

// Function to check if the user is authenticated
const isAuthenticatedFunc =async () => {
  if(!getAccessToken()) return false;

  const user=await isTokenValid(getAccessToken()); 
  if(!user) return false;
  return true;
}
// Define the props for the PrivateRoute component
interface PrivateRouteProps {
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = () => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticatedFunc();
      setAuth(result);
    };
    checkAuth();
  }, []);

  if (auth === null) {
    // Optionally, render a loading spinner while checking authentication
    return <p>Loading...</p>;
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoute;
