import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Verificar si el usuario está autenticado y es admin
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/not-authorized" />;
  }

  return <Outlet />;
}