import React, { createContext, useContext, useState } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('/');
  const history = useNavigate();

  const login = (redirectTo) => {
    setIsAuthenticated(true);
    history.push(redirectTo || '/');
  };

  const logout = () => {
    setIsAuthenticated(false);
    history.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, setRedirectUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
