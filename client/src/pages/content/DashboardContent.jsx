// components/content/DashboardContent.jsx
import React from 'react';

const DashboardContent = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Panel Principal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Tarjetas de estadísticas */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Usuarios</h3>
              <p className="text-2xl font-bold text-gray-900">1,257</p>
              <p className="text-sm text-green-600">+12% este mes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Ventas</h3>
              <p className="text-2xl font-bold text-gray-900">$45,526</p>
              <p className="text-sm text-green-600">+8.2% este mes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Productos</h3>
              <p className="text-2xl font-bold text-gray-900">352</p>
              <p className="text-sm text-green-600">+24 nuevos</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-t-2 border-green-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Ventas Mensuales</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Gráfico de Ventas
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-t-2 border-green-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Actividad Reciente</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Actividad {item}</p>
                  <p className="text-sm text-gray-500">Hace {item * 2} horas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;