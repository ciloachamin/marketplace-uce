import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FALLBACK_LIMIT = 5;

const ProductReel = (props) => {
  const { title, subtitle, href, query } = props;
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(href);
  console.log(title);
  
  
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch("/api/product/get?sort=-name");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al cargar productos");
        }

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  let map = [];
  if (products && products.length) {
    map = products.slice(0, query?.limit || FALLBACK_LIMIT);
  } else if (isLoading) {
    map = new Array(query?.limit || FALLBACK_LIMIT).fill(null);
  }

  return (
    <section style={{ padding: '3rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ maxWidth: '42rem', padding: '0 1rem' }}>
          {title && (
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', margin: 0 }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
              {subtitle}
            </p>
          )}
        </div>

        {href && (
          <Link
            to={href}
            aria-label="Compre la colección"
            className="text-primary/90"
            style={{ fontSize: '0.875rem', fontWeight: '500'}}
          >
            Compre la colección{' '}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ 
            width: '100%', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '1rem'
          }}>
            {map.map((product, i) => (
              <ProductListing
                key={product ? `product-${product._id}` : `placeholder-${i}`}
                product={product}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductListing = ({ product, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  const isOutOfStock = product.stock === 0;
  const linkHref = `/product/${product._id}`;

  return (
    <a
      style={{
        display: 'block',
        height: '100%',
        width: '100%',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative'
      }}
      aria-label="Productos"
      href={linkHref}
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%' }}>
        {!isOutOfStock && product.stock && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(229, 231, 235, 0.8)',
            borderRadius: '9999px',
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            margin: '0.25rem',
            zIndex: 10
          }}>
            {`Stock: ${product.stock}`}
          </div>
        )}

        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: '#ef4444',
            backgroundColor: 'rgba(229, 231, 235, 0.8)',
            borderRadius: '9999px',
            fontWeight: 'bold',
            zIndex: 10,
            padding: '0.5rem 1rem',
            margin: '0.25rem',
            fontSize: '0.875rem'
          }}>
            AGOTADO
          </div>
        )}

        {/* Product Image */}
        <div style={{ 
          aspectRatio: '1/1', 
          backgroundColor: '#f3f4f6', 
          position: 'relative',
          overflow: 'hidden'
        }}>
          {product.imageUrls && product.imageUrls.length > 0 ? (
            <img 
              src={product.imageUrls[0]} 
              alt={product.name} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb' }} />
          )}
        </div>

        {/* Product Info */}
        <div style={{ padding: '1rem' }}>
          <h2 style={{ 
            margin: '0 0 0.25rem 0', 
            fontWeight: '600', 
            fontSize: '1rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {product.name}
          </h2>
          
          <p style={{ 
            margin: '0 0 0.25rem 0', 
            fontSize: '0.875rem', 
            color: '#6b7280',
            textTransform: 'capitalize'
          }}>
            {product.category}
          </p>
          
          {product.userRef && (
            <p style={{ 
              margin: '0 0 0.25rem 0', 
              fontSize: '0.875rem', 
              color: '#6b7280',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Vendedor: {product.userRef.name} {product.userRef.lastname}
            </p>
          )}
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: '0.5rem'
          }}>
            <p style={{ 
              margin: 0, 
              fontWeight: '600', 
              fontSize: '1rem',
              color: '#1f2937'
            }}>
              {formatPrice(product.price)}
            </p>
            
            {/* Rating */}
            {product.rating > 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}>
                <span style={{ color: '#f59e0b', marginRight: '0.25rem' }}>★</span>
                <span style={{ fontSize: '0.875rem' }}>{product.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

const ProductPlaceholder = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        position: 'relative', 
        backgroundColor: '#f3f4f6', 
        aspectRatio: '1/1', 
        width: '100%', 
        overflow: 'hidden'
      }}>
        <div style={{ height: '100%', width: '100%', backgroundColor: '#e5e7eb' }} />
      </div>
      <div style={{ padding: '1rem' }}>
        <div style={{ 
          marginBottom: '0.5rem', 
          width: '80%', 
          height: '1rem', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '4px' 
        }} />
        <div style={{ 
          marginBottom: '0.5rem', 
          width: '60%', 
          height: '0.875rem', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '4px' 
        }} />
        <div style={{ 
          width: '40%', 
          height: '1rem', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '4px' 
        }} />
      </div>
    </div>
  );
};

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export default ProductReel;