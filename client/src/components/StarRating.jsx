import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Componente separado para las estrellas
const StarRating = ({ rating = 0 }) => {
  // Asegurarse de que rating es un número y está dentro del rango 0-5
  const safeRating = typeof rating === 'number' ? Math.min(Math.max(rating, 0), 5) : 0;
  
  // Crear un array para representar las 5 estrellas
  const stars = [];
  
  // Calcular estrellas completas, medias y vacías
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;
  
  // Generar estrellas
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      // Estrella completa
      stars.push(
        <FaStar key={i} className="text-yellow-500 w-4 h-4" />
      );
    } else if (i === fullStars && hasHalfStar) {
      // Media estrella
      stars.push(
        <FaStarHalfAlt key={i} className="text-yellow-500 w-4 h-4" />
      );
    } else {
      // Estrella vacía
      stars.push(
        <FaRegStar key={i} className="text-gray-300 w-4 h-4" />
      );
    }
  }
  
  return (
    <div className="flex items-center">
      {stars}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        ({safeRating.toFixed(1)})
      </span>
    </div>
  );
};

export default StarRating;