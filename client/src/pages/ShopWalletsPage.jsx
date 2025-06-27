import { useEffect, useState } from 'react';
import { FaClock, FaMapMarkerAlt, FaPhone, FaShare, FaStar, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Contact from '../components/Contact';

export default function ShopsList() {
  SwiperCore.use([Navigation]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShop, setSelectedShop] = useState(null);
  const [contact, setContact] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Categorías disponibles
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'restaurant', name: 'Restaurantes' },
    { id: 'retail', name: 'Tiendas' },
    { id: 'service', name: 'Servicios' },
    { id: 'other', name: 'Otros' }
  ];

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/shop/get', {
          credentials: 'include', 
        });
        const data = await res.json();
        if (data.success === false) {
          setError(true);
        } else {
          setShops(data);
        }
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  // Filtrar negocios según búsqueda y categoría
  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         shop.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || shop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Ver detalles de un negocio
  const viewShopDetails = (shop) => {
    setSelectedShop(shop);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header con buscador */}
      <div className="bg-gradient-to-r from-primary to-black py-8 px-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Descubre los mejores negocios</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar negocios..."
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">Error al cargar los negocios. Por favor intenta nuevamente.</p>
          </div>
        ) : (
          <>

            {/* Listado de negocios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <Link
                    to={`/shop/${shop._id}`} 
                    key={shop._id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <div className="h-48 relative">
                      {shop.imageUrls && shop.imageUrls.length > 0 && (
                        <img
                          src={shop.imageUrls[0]}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="font-medium">{shop.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-start">
                        {shop.logo && (
                          <img 
                            src={shop.logo} 
                            alt={`${shop.name} logo`} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md -mt-8 mr-3"
                          />
                        )}
                        
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{shop.name}</h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {shop.category === 'restaurant' && 'Restaurante'}
                            {shop.category === 'retail' && 'Tienda'}
                            {shop.category === 'service' && 'Servicio'}
                            {shop.category === 'other' && 'Otro'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="flex items-center text-gray-600 text-sm">
                          <FaMapMarkerAlt className="text-indigo-500 mr-2" />
                          <span className="truncate">{shop.address}</span>
                        </p>
                        
                        {shop.description && (
                          <p className="text-gray-500 mt-2 line-clamp-2">
                            {shop.description}
                          </p>
                        )}
                      </div>
                      
                      <button className="mt-4 w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                        Ver detalles
                      </button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-600 mt-4">No se encontraron negocios</h3>
                  <p className="text-gray-500 mt-2">Intenta con otros términos de búsqueda</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}