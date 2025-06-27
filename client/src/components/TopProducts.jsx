import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { Link } from "react-router-dom";
import StarRating from "./StarRating"; // Importa el nuevo componente

const TopProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch("/api/product/get?sort=-rating&limit=3");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <PropagateLoader color="#3B82F6" />
      </div>
    );
  }

  console.log(products);
  

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-medium">
        <div className="bg-red-50 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-lg">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded-full hover:bg-red-200 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary/5 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span 
            data-aos="fade-up" 
            className="inline-block text-sm font-semibold text-primary/80 dark:text-primary tracking-wider uppercase bg-primary/5 dark:bg-blue-900/30 px-3 py-1 rounded-full mb-3"
          >
            Top
          </span>
          <h2 
            data-aos="fade-up" 
            data-aos-delay="100" 
            className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Productos Destacados
          </h2>
          <p 
            data-aos="fade-up" 
            data-aos-delay="200" 
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Los productos mejor valorados por nuestros clientes. Calidad y satisfacción garantizada.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <div
              key={product._id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="relative group"
            >
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                    Top {index + 1}
                  </span>
                </div>

                {/* Image Container */}
                <div className="relative pt-8 px-6 flex items-center justify-center h-64 overflow-hidden bg-gradient-to-b from-primary/10 to-white dark:from-primary/10 dark:to-gray-900">
                  <img
                    src={product.imageUrls?.[0] || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="h-48 w-48 object-contain transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Rating - Usando el nuevo componente */}
                  <div className="mb-3">
                    <StarRating rating={product.rating || 0} />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-white transition-colors group-hover:text-primary/80 dark:group-hover:text-primary">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 flex-grow">
                    {product.description}
                  </p>

                  {/* Button */}
                  <Link
                    to={`/product/${product._id}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-300 transform group-hover:translate-y-0 mt-auto"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    <span>Comprar Ahora</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProduct;