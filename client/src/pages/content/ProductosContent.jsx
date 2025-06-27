// components/content/ProductosContent.jsx
import React from 'react';

const ProductosContent = () => {
  const productos = [
    { id: 1, nombre: 'Producto 1', categoria: 'Electrónica', precio: 1200, stock: 25 },
    { id: 2, nombre: 'Producto 2', categoria: 'Ropa', precio: 450, stock: 40 },
    { id: 3, nombre: 'Producto 3', categoria: 'Hogar', precio: 780, stock: 12 },
    { id: 4, nombre: 'Producto 4', categoria: 'Electrónica', precio: 2500, stock: 8 },
    { id: 5, nombre: 'Producto 5', categoria: 'Ropa', precio: 350, stock: 50 },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Productos</h2>
        <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-md">
          Añadir Producto
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.categoria}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${producto.precio}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      producto.stock > 20 ? 'bg-green-100 text-green-800' : 
                      producto.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {producto.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-900">Editar</button>
                      <button className="text-red-600 hover:text-red-900">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductosContent;