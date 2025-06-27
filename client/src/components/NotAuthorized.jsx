import { Link } from 'react-router-dom';
import { FiShieldOff } from 'react-icons/fi';

export default function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
          <FiShieldOff className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Acceso no autorizado</h1>
        <p className="text-gray-600 mb-6">
          No tienes permisos para acceder a esta página.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black shadow-sm transition-colors duration-200"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}