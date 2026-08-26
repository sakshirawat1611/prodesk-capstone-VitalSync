import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // no token = force redirect to /login, exactly per spec
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;