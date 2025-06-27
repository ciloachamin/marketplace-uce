import React, { useEffect, useState } from "react";

const Card = ({ product, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  console.log(product);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  return (
    <a
      className={`h-full w-full cursor-pointer group ${
        isVisible ? "visible animate-fade-in" : "invisible"
      }`}
      href={`/product/${product._id}`}
      aria-label="Productos"
    >
      <div className="max-w-sm h-full bg-secundary overflow-hidden shadow-lg">
        <div className="h-4/6 relative max-sm:h-3/5">
          <img
            src={product.imageUrls[0]}
            alt="Product image"
            className="h-full w-full"
            loading="eager"
            style={{
                width: '100%',
                height: '100%', 
                objectFit: 'cover' 
              }}
          />
          <div className="absolute bottom-0 left-0 px-2 pb-1">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              Precio: ${product.price}
            </span>
          </div>
          <div className="absolute right-0 px-2 pt-1">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {product.campus}
            </span>
          </div>
        </div>
        <div className="px-6 pt-4">
          <div className="font-bold text-xl mb-2">{product.name}</div>
          <p
            className="text-secondary-foreground text-base overflow-y-auto h-16"
            tabIndex={0}
            role="region"
            aria-label="Scrollable content"
          >
            {product.description}
          </p>
        </div>
        <div className="px-6 pt-2 pb-2">
          {product.userRef ? (
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              Vendedor: {product.userRef.name} {product.userRef.lastname}
            </span>
          ) : (
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              No hay información del vendedor disponible.
            </span>
          )}

          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {product.category}
          </span>
        </div>
      </div>
    </a>
  );
};

const ProductPlaceholder = () => (
  <div className="max-w-sm h-full bg-secondary overflow-hidden shadow-lg">
    <div className="h-full w-full bg-gray-300 animate-pulse"></div>
  </div>
);

export default Card;
