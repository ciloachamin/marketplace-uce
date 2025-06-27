import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
export default function PrivateRoute({ allowedRoles = [] }) {
  const { currentUser } = useSelector((state) => state.user);
  
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
