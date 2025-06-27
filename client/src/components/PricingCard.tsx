import React from 'react';
import WhatsAppButton from './WhatsAppButton';
import { FiCheck } from 'react-icons/fi';

const PricingCard = ({
  title,
  description,
  promo,
  price,
  time,
  features,
  buttonText,
  buttonMessage,
  buttonNumber,
  featured = false
}) => {
  return (
    <div className={`flex flex-col w-full h-full p-6 mx-auto 
      ${featured ? 'border-2 border-blue-500' : 'border border-gray-200'} 
      rounded-lg shadow-sm bg-white transition-all hover:shadow-md`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-lg font-light">{description}</p>
      </div>

      {/* Promo badge */}
      {promo && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
            {promo}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="my-6 flex items-baseline">
        <span className="text-5xl font-extrabold">{price}</span>
        <span className="ml-1 text-gray-500">/{time}</span>
      </div>

      {/* Features list */}
      <ul className="mb-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <FiCheck className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5 mr-2" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Terms */}
      <div className="mt-auto mb-4">
        <p className="text-xs text-gray-500">* Aplican condiciones</p>
      </div>

      {/* WhatsApp Button */}
      <div className="mt-auto">
        <WhatsAppButton 
          phoneNumber={buttonNumber} 
          message={buttonMessage} 
          text={buttonText}
          className={`w-full ${featured ? 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900' : 'bg-gray-800 hover:bg-gray-900'}`}
        />
      </div>
    </div>
  );
};

export default PricingCard;