import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FALLBACK_LIMIT = 5;

const ShopReel = (props) => {
  const { title, subtitle, href, query } = props;
  const [shops, setShops] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopShops = async () => {
      try {
        const response = await fetch("/api/shop/get?sort=-rating");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al cargar negocios");
        }

        setShops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopShops();
  }, []);

  let map = [];
  if (shops && shops.length) {
    map = shops.slice(0, query?.limit || FALLBACK_LIMIT);
  } else if (isLoading) {
    map = new Array(query?.limit || FALLBACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="max-w-3xl">
          {title && (
            <h1 className="text-2xl font-bold text-gray-800">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {href && (
          <Link
            to={href}
            aria-label="Ver todos los negocios"
            className="text-sm font-medium text-primary/90 hover:text-primary"
          >
            Ver todos <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      <div className="relative px-4">
        <div className="mt-6 w-full overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {map.map((shop, i) => (
              <ShopListing
                key={shop ? `shop-${shop._id}` : `placeholder-${i}`}
                shop={shop}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ShopListing = ({ shop, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  if (!shop || !isVisible) return <ShopPlaceholder />;

  const linkHref = `/shop/${shop._id}`;

  const getCategoryName = (category) => {
    switch(category) {
      case 'restaurant': return 'Restaurante';
      case 'retail': return 'Tienda';
      case 'service': return 'Servicio';
      case 'other': return 'Otro';
      default: return category;
    }
  };

  return (
    <Link
      className={`block h-full w-full cursor-pointer no-underline text-inherit transition-opacity duration-300 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md relative ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      aria-label="Negocio"
      to={linkHref}
    >
      <div className="relative flex flex-col w-full">
        {/* Shop Image */}
        <div className="aspect-video bg-gray-100 relative overflow-hidden">
          {shop.imageUrls && shop.imageUrls.length > 0 ? (
            <img 
              src={shop.imageUrls[0]} 
              alt={shop.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        {/* Shop Info */}
        <div className="p-4">
          <div className="flex items-center mb-2">
            {shop.logo && (
              <img 
                src={shop.logo} 
                alt={`${shop.name} logo`}
                className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
              />
            )}
            <h2 className="m-0 font-semibold text-base truncate flex-1">
              {shop.name}
            </h2>
          </div>
          
          {/* <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-sm ${i < Math.floor(shop.rating) ? 'text-yellow-500' : 'text-gray-200'}`}
                >
                  ★
                </span>
              ))}
              <span className="text-sm ml-1">
                ({shop.rating || 'Nuevo'})
              </span>
            </div>
          </div> */}
          
          <p className="m-0 mb-1 text-sm text-gray-500 flex items-center">
            <span className="mr-1">📍</span>
            <span className="truncate">
              {shop.address}
            </span>
          </p>
          
          <p className="m-0 mb-1 text-sm text-gray-500 flex items-center">
            <span className="mr-1">🕒</span>
            {shop.openingHours} - {shop.closingHours}
          </p>
          
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
              {getCategoryName(shop.category)}
            </span>
            
            <span className="text-xs text-blue-500 font-medium">
              Ver más →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ShopPlaceholder = () => {
  return (
    <div className="flex flex-col w-full bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="relative bg-gray-100 aspect-video w-full overflow-hidden">
        <div className="h-full w-full bg-gray-200" />
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
          <div className="w-3/5 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-4/5 h-3 bg-gray-200 rounded mb-2" />
        <div className="w-3/4 h-3 bg-gray-200 rounded mb-2" />
        <div className="w-3/5 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default ShopReel;