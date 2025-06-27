import { useSelector } from 'react-redux';

export default function RoleProtectedElement({
  children,
  allowedRoles = [],
  fallback = null
}) {
  const { currentUser } = useSelector((state) => state.user);

  // Si no hay usuario o el rol no está permitido
  if (!currentUser || (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role))) {
    return fallback;
  }

  return children;
}