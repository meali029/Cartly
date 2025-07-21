import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
  // Use the correct key for user storage
  const user = JSON.parse(localStorage.getItem('cratlyUser'));
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // ✅ If route is admin-only and user is not admin, redirect
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
