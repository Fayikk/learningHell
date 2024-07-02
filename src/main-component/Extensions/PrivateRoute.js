import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Nav } from 'react-bootstrap';

const PrivateRoute = ({children}) => {

  const location = useLocation();
  const token = localStorage.getItem("token");

  return (
    <>
    {
      token != null ? children : <Navigate to="/login" replace state={{from:location}} ></Navigate>
    }
    </>
  );
};

export default PrivateRoute;
