
import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    const checkLoggedIn = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await api.get('/auth/me');
          
          if (res.data.success) {
            setUser(res.data.data);
          }
        } catch (err) {
          
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);


  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await api.post('/auth/login', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};