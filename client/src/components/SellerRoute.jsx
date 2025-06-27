import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function SellerRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Verificar si el usuario está autenticado y es seller/shop
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  if (currentUser.role !== 'seller' && currentUser.role !== 'shop') {
    return <Navigate to="/not-authorized" />;
  }

  return <Outlet />;
}