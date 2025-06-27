import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { fetchListings } from '../redux/reducers/listingSlice';

export default function Search() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  // Obtener parámetros de búsqueda desde la URL
  const searchTerm = searchParams.get('searchTerm');
  const category = searchParams.get('category');
  
  // Estado de Redux
  const { listings, loading, error, totalListings } = useSelector(state => state.listing);
  console.log(listings);
  console.log(totalListings);
  console.log(loading);
  console.log(error);
  console.log(searchTerm);
  
  
  console.log(listings.listings);
  
  const [filters, setFilters] = useState({
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt_desc',
    minPrice: 0,
    maxPrice: 10000,
    page: 1
  });

  useEffect(() => {
    const hasActiveFilters = 
      searchTerm || 
      category || 
      filters.type !== 'all' || 
      filters.parking || 
      filters.furnished || 
      filters.offer || 
      filters.sort !== 'createdAt_desc' || 
      filters.minPrice > 0 || 
      filters.maxPrice < 10000;
  
    const searchQuery = hasActiveFilters ? {
      ...(searchTerm && { searchTerm }),
      ...(category && { category }),
      ...filters
    } : {};
  
    dispatch(fetchListings(searchQuery));
  }, [searchTerm, category, filters, dispatch]);

  const handleFilterChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'type' && value === 'all') {
      setFilters({
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt_desc',
        minPrice: 0,
        maxPrice: 10000,
        page: 1
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value,
        page: 1
      }));
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Panel de filtros */}
            <aside className="w-full lg:w-1/4 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Tipo</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="type"
                      value="all"
                      checked={filters.type === 'all'}
                      onChange={() => setFilters(prev => ({ ...prev, type: 'all' }))}
                      className="rounded text-indigo-600"
                    />
                    <span>Todos</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="type"
                      value="rent"
                      checked={filters.type === 'rent'}
                      onChange={() => setFilters(prev => ({ ...prev, type: 'rent' }))}
                      className="rounded text-indigo-600"
                    />
                    <span>Renta</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="type"
                      value="sale"
                      checked={filters.type === 'sale'}
                      onChange={() => setFilters(prev => ({ ...prev, type: 'sale' }))}
                      className="rounded text-indigo-600"
                    />
                    <span>Venta</span>
                  </label>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Características</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="parking"
                      checked={filters.parking}
                      onChange={handleFilterChange}
                      className="rounded text-indigo-600"
                    />
                    <span>Estacionamiento</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="furnished"
                      checked={filters.furnished}
                      onChange={handleFilterChange}
                      className="rounded text-indigo-600"
                    />
                    <span>Amueblado</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="offer"
                      checked={filters.offer}
                      onChange={handleFilterChange}
                      className="rounded text-indigo-600"
                    />
                    <span>En oferta</span>
                  </label>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Ordenar por</h3>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="createdAt_desc">Más recientes</option>
                  <option value="createdAt_asc">Más antiguos</option>
                  <option value="price_desc">Mayor precio</option>
                  <option value="price_asc">Menor precio</option>
                </select>
              </div>
            </aside>

            {/* Resultados de búsqueda */}
            <section className="w-full lg:w-3/4">
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-semibold">
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los resultados'}
                  {category && ` en ${category}`}
                </h2>
                <p className="text-gray-600 mt-1">{totalListings} {totalListings === 1 ? 'resultado' : 'resultados'}</p>
              </div>

              {/* Estado de carga y error */}
              {loading && (
                <div className="text-center py-8">
                  <p>Cargando resultados...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-red-500">
                  <p>Error al cargar los resultados: {error}</p>
                </div>
              )}

              {/* Listado de resultados */}
              {!loading && listings.length === 0 && (
                <div className="text-center py-8">
                  <p>No se encontraron resultados con los filtros seleccionados</p>
                </div>
              )}

              {!loading && listings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))}
                </div>
              )}

              {/* Paginación */}
              {!loading && totalListings > 10 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex gap-2">
                    {Array.from({ length: Math.ceil(totalListings / 10) }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 rounded ${filters.page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}