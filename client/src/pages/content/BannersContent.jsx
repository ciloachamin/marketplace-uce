// components/content/BannersContent.jsx
import React from 'react';

const BannersContent = () => {
  const banners = [
    { id: 1, titulo: 'Oferta Especial', ubicacion: 'Página Principal', activo: true, fechaInicio: '2025-03-10', fechaFin: '2025-04-10' },
    { id: 2, titulo: 'Nuevos Productos', ubicacion: 'Categorías', activo: true, fechaInicio: '2025-03-15', fechaFin: '2025-03-30' },
    { id: 3, titulo: 'Descuentos de Temporada', ubicacion: 'Página Principal', activo: false, fechaInicio: '2025-02-01', fechaFin: '2025-02-28' },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Banners</h2>
        <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-md">
          Crear Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="h-40 bg-green-50 flex items-center justify-center border-b border-gray-200">
              <svg className="w-16 h-16 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-green-900">{banner.titulo}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">Ubicación: {banner.ubicacion}</p>
                <p className="text-sm text-gray-600">Período: {banner.fechaInicio} - {banner.fechaFin}</p>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Estado:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    banner.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">Editar</button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannersContent;