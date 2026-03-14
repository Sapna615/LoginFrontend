import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api';

// Create context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  isAuthenticated: false,
};

// Action types
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAIL = 'AUTH_FAIL';
const LOGOUT = 'LOGOUT';
const SET_LOADING = 'SET_LOADING';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = async () => {
    if (!api) {
      // No API configured - skip authentication check
      dispatch({ type: AUTH_FAIL });
      return;
    }
    
    if (localStorage.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
    }

    try {
      const res = await api.get('/api/auth/me');
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          token: localStorage.token,
          user: res.data.user,
        },
      });
    } catch (err) {
      dispatch({ type: AUTH_FAIL });
    }
  };

  // Register user
  const register = async (formData) => {
    if (!api) return; // Silently fail if no API
    
    try {
      const res = await api.post('/api/auth/register', formData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_FAIL });
      throw err.response.data;
    }
  };

  // Login user
  const login = async (formData) => {
    if (!api) return; // Silently fail if no API
    
    try {
      const res = await api.post('/api/auth/login', formData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_FAIL });
      throw err.response.data;
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: LOGOUT });
    delete api.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
