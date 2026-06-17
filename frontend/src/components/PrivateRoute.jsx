import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}