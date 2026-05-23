import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CustomerRoute({ children }) {
  const { user } = useSelector(s => s.auth);

  // If admin user, redirect to admin panel
  if (user?.role === 'Admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
