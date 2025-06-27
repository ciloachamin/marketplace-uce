import React, { useEffect } from 'react';

// Definimos las propiedades que recibirá el componente WhatsAppButton
const WhatsAppButton = ({ 
  phoneNumber, 
  message, 
  text, 
  icon: Icon, 
  autoSend = false, 
  className = '' 
}) => {
  const baseUrl = 'https://wa.me/';

  // Efecto para enviar automáticamente el mensaje si autoSend es true
  useEffect(() => {
    if (autoSend) {
      window.location.href = `${baseUrl}${"593"+phoneNumber}?text=${encodeURIComponent(message)}`;
    }
  }, [autoSend, phoneNumber, message]);

  return (
    <a
      aria-label="Chat on WhatsApp"
      href={`${baseUrl}${"593"+phoneNumber}?text=${encodeURIComponent(message)}`}
      className={`flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {text}
    </a>
  );
};

export default WhatsAppButton;
