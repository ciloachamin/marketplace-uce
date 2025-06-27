import { useState } from 'react';
import { useSelector } from 'react-redux';
import QRScanner from '../components/QRScanner';
import { useNavigate } from 'react-router-dom';

export default function QRScannerPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  // Verificación de acceso
  if (currentUser?.role !== 'seller' && currentUser?.role !== 'shop' && currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Acceso no autorizado</h1>
          <p className="text-gray-500 mb-6">Esta función está disponible solo para negocios registrados.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escanear Códigos QR</h1>
          <p className="text-lg text-gray-600">Añade puntos a las billeteras digitales de tus clientes</p>
        </div>

        {/* Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium text-gray-900">¿Cómo funciona?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Escanea el código QR de tus clientes para añadir puntos a su billetera.
                  Cada compra o acción que merezca puntos puede ser registrada aquí.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setShowScanner(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary to-black p-4 hover:bg-gradient-to-r hover:to-primary hover:from-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
              >
                <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Iniciar escaneo
              </button>
            </div>
          </div>
        </div>

        {/* Scanner Modal */}
        {showScanner && (
          <QRScanner 
            onClose={() => setShowScanner(false)}
            onScan={(data) => {
              console.log('Puntos añadidos:', data);
              // Aquí puedes añadir lógica adicional después del escaneo
            }}
          />
        )}
      </div>
    </div>
  );
}