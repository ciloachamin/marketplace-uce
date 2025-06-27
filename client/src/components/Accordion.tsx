

import React from 'react';
import { useState } from 'react';

// Definimos las propiedades que recibirá el componente Accordion
const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar la apertura y cierre del acordeón
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ borderRadius: '6px', overflow: 'hidden', width: '75%' }}>
      {/* Encabezado del acordeón */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease-in-out',
        }}
        onClick={toggleAccordion}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h3>
        <span
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {/* Icono de flecha hacia abajo (simulado con texto) */}
          ▼
        </span>
      </div>

      {/* Contenido del acordeón */}
      <div
        style={{
          transition: 'all 0.3s ease-in-out',
          maxHeight: isOpen ? '400px' : '0',
          overflow: 'hidden',
          padding: isOpen ? '16px' : '0',
          borderTop: isOpen ? '1px solid #e5e7eb' : 'none',
          opacity: isOpen ? '1' : '0',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;