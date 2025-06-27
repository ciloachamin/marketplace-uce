import React from "react";
import { FaUtensils, FaShoePrints, FaHamburger, FaIceCream, FaWineGlassAlt } from "react-icons/fa";

const MenuCard = ({ menu }) => {
  // Agrupar items por categoría
  const itemsByCategory = menu.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Obtener icono según categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'sopa':
        return <FaShoePrints className="inline mr-2" />;
      case 'plato_principal':
        return <FaHamburger className="inline mr-2" />;
      case 'postre':
        return <FaIceCream className="inline mr-2" />;
      case 'bebida':
        return <FaWineGlassAlt className="inline mr-2" />;
      default:
        return <FaUtensils className="inline mr-2" />;
    }
  };

  // Traducir categorías
  const translateCategory = (category) => {
    const translations = {
      'sopa': 'Sopas',
      'plato_principal': 'Platos Principales',
      'postre': 'Postres',
      'bebida': 'Bebidas',
      'entrada': 'Entradas'
    };
    return translations[category] || category;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 border border-gray-200">
      {/* Encabezado del menú */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 text-white">
        <h2 className="text-2xl font-bold uppercase">{menu.name}</h2>
        <p className="italic">{menu.description}</p>
        {menu.date && (
          <p className="text-sm mt-1">
            <span className="font-semibold">Fecha:</span> {new Date(menu.date).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Contenido del menú */}
      <div className="p-4">
        {Object.entries(itemsByCategory).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h3 className="text-xl font-semibold text-green-700 border-b border-green-200 pb-1 mb-2">
              {getCategoryIcon(category)}
              {translateCategory(category)}
            </h3>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium text-gray-800">{item.name}</span>
                    {item.description && (
                      <p className="text-sm text-gray-600 italic">{item.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-green-700">${item.price}</span>
                    {item.secondPrice && (
                      <span className="block text-xs text-gray-500">${item.secondPrice}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCard;