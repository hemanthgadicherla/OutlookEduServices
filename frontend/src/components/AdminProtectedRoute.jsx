import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

// Reads the JWT from localStorage — no API call needed.
// Redirects to /admin/login if token is missing, expired, or not admin role.
const AdminProtectedRoute = ({ children }) => {
  const user = getUser(); // { id, email, role, full_name } or null

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
