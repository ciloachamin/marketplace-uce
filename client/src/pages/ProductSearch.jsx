import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../components/ProductItem";
import { fetchProducts } from "../redux/reducers/productSlice";
import { fetchCategories } from "../redux/reducers/categorySlice";

const FilterSection = ({ title, children, isOpen = true, onToggle }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
    <div
      className="flex justify-between items-center cursor-pointer"
      onClick={onToggle}
    >
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 text-gray-500 transform transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <div className={`mt-3 ${isOpen ? "block" : "hidden"}`}>{children}</div>
  </div>
);

const PriceRangeFilter = ({ minPrice, maxPrice, onChange }) => {
  const handleMinChange = (e) => onChange("minPrice", parseInt(e.target.value));
  const handleMaxChange = (e) => onChange("maxPrice", parseInt(e.target.value));

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span className="text-gray-500">Rango:</span>
        <span className="font-medium text-primary">
          ${minPrice} - ${maxPrice}
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <input
          type="range"
          min="0"
          max="1000"
          step="0"
          value={minPrice}
          onChange={handleMinChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
      <div className="flex gap-4 items-center">
        <input
          type="range"
          min="0"
          max="1000"
          step="0"
          value={maxPrice}
          onChange={handleMaxChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
      <div className="flex gap-3 mt-4">
        <div className="flex-1">
          <label
            htmlFor="minPrice"
            className="block text-xs text-gray-500 mb-1"
          >
            Mínimo
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={handleMinChange}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex-1">
          <label
            htmlFor="maxPrice"
            className="block text-xs text-gray-500 mb-1"
          >
            Máximo
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={handleMaxChange}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="10000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para filtros de selección
const SelectFilter = ({
  id,
  value,
  options,
  onChange,
  placeholder,
  optionValueKey = "value",
  optionLabelKey = "label",
}) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTcyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em]"
    >
      <option value="all">{placeholder}</option>
      {options.map((option, index) => (
        <option
          key={option[optionValueKey] || index}
          value={option[optionValueKey]}
        >
          {option[optionLabelKey]}
        </option>
      ))}
    </select>
  </div>
);

// Componente para filtros de checkbox
// Modifica el componente CheckboxFilter para manejar correctamente el cambio
const CheckboxFilter = ({ id, label, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange(id, !checked)}
      className="hidden"
    />
    <div
      className={`flex items-center justify-center w-5 h-5 border-2 rounded ${
        checked
          ? "text-primary/80 border-primary bg-primary"
          : "border-gray-300 group-hover:border-primary/80"
      } transition-colors`}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
    <span className="text-gray-700 group-hover:text-primary transition-colors">
      {label}
    </span>
  </label>
);

// Componente para filtros de rating
const RatingFilter = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-3">
      {[5, 4, 3, 2, 1].map((rating) => (
        <label
          key={rating}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <input
            type="radio"
            name="rating"
            checked={parseInt(value) === rating}
            onChange={() => onChange("minRating", rating)}
            className="sr-only peer"
          />
          <div
            className={`flex ${
              parseInt(value) === rating
                ? "text-yellow-400"
                : "text-gray-300 group-hover:text-yellow-300"
            }`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < rating ? "current-color" : "text-gray-200"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span
            className={`text-sm ${
              parseInt(value) === rating
                ? "text-gray-800 font-medium"
                : "text-gray-600"
            } group-hover:text-primary`}
          >
            {rating}+ estrellas
          </span>
        </label>
      ))}
    </div>
  );
};

export default function ProductSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Obtener parámetros de búsqueda desde la URL
  const searchTerm = searchParams.get("searchTerm");
  const category = searchParams.get("category");
  console.log(category);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.category);
  console.log(categories);

  // Estado de Redux
  const { products, loading, error, totalProducts } = useSelector(
    (state) => state.product
  );

  // Estado local para filtros
  const [filters, setFilters] = useState({
    brand: "all",
    shopName: "",
    minPrice: 0,
    maxPrice: 1000,
    discount: false,
    approvedForSale: false,
    campus: "all",
    minRating: 0,
    sort: "createdAt_desc",
    page: 1,
  });

  // Estado para controlar qué filtros están visibles en móvil
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Estado para secciones expandidas/colapsadas
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    category: true,
    brand: true,
    shop: true,
    price: true,
    campus: true,
    features: true,
    rating: true,
  });

  // Filtros activos para mostrar como chips
  const [activeFilters, setActiveFilters] = useState([]);
  const CAMPUS_OPTIONS = {
    matriz: "Campus Matriz",
    "iasa-1": "Campus Iasa",
    "santo-domingo": "Campus SantoDomingo",
    latacunga: "Campus Latacunga",
  };

  // Opciones para filtros
  const filterOptions = {
    // brands: ["Nike", "Apple", "Samsung", "Adidas", "Sony"],
    campuses: Object.entries(CAMPUS_OPTIONS).map(([value, label]) => ({
      value,
      label,
    })),
    sortOptions: [
      { value: "createdAt_desc", label: "Más recientes" },
      { value: "createdAt_asc", label: "Más antiguos" },
      { value: "price_desc", label: "Mayor precio" },
      { value: "price_asc", label: "Menor precio" },
      { value: "rating_desc", label: "Mejor valorados" },
      { value: "discount_desc", label: "Mayor descuento" },
    ],
  };

  // Actualizar filtros y calcular filtros activos
  const handleFilterChange = (id, value) => {
    setFilters((prev) => ({
      ...prev,
      [id]: id === "discount" || id === "approvedForSale" ? !prev[id] : value,
      page: 1,
    }));
  };

  // Toggle para expandir/colapsar secciones
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Calcular filtros activos para mostrar como chips
  useEffect(() => {
    const active = [];

    if (searchTerm) active.push({ id: "searchTerm", label: `"${searchTerm}"` });
    if (category && category !== "all")
      active.push({ id: "category", label: `Categoría: ${category}` });
    if (filters.brand !== "all")
      active.push({ id: "brand", label: `Marca: ${filters.brand}` });
    if (filters.shopName)
      active.push({ id: "shopName", label: `Tienda: ${filters.shopName}` });
    if (filters.minPrice > 0)
      active.push({ id: "minPrice", label: `Mín: $${filters.minPrice}` });
    if (filters.maxPrice < 100)
      active.push({ id: "maxPrice", label: `Máx: $${filters.maxPrice}` });
    if (filters.campus !== "all")
      active.push({ id: "campus", label: `Campus: ${filters.campus}` });
    if (filters.discount) active.push({ id: "discount", label: "Descuento" });
    if (filters.approvedForSale)
      active.push({ id: "approvedForSale", label: "Aprobados" });
    if (filters.minRating > 0)
      active.push({ id: "minRating", label: `⭐ ${filters.minRating}+` });

    setActiveFilters(active);
  }, [searchTerm, category, filters]);

  // Eliminar un filtro activo
  const removeFilter = (id) => {
    if (id === "searchTerm") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("searchTerm");
      navigate({ search: newParams.toString() });
    } else if (id === "category") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("category");
      navigate({ search: newParams.toString() });
    } else {
      handleFilterChange(
        id,
        id.includes("Price")
          ? id === "minPrice"
            ? 0
            : 10000
          : id.includes("min")
          ? 0
          : false
      );
    }
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    navigate({ search: newParams.toString() });
    setFilters({
      brand: "all",
      shopName: "",
      minPrice: 0,
      maxPrice: 100,
      discount: false,
      approvedForSale: false,
      campus: "all",
      minRating: 0,
      sort: "createdAt_desc",
      page: 1,
    });
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  // Fetch products cuando cambian los filtros
  useEffect(() => {
    const hasActiveFilters =
      searchTerm ||
      category ||
      filters.brand !== "all" ||
      filters.shopName ||
      filters.discount ||
      filters.approvedForSale ||
      filters.campus !== "all" ||
      filters.minRating > 0 ||
      filters.sort !== "createdAt_desc" ||
      filters.minPrice > 0 ||
      filters.maxPrice < 1000;

    const searchQuery = hasActiveFilters
      ? {
          ...(searchTerm && { searchTerm }),
          ...(category && { category }),
          ...filters,
        }
      : {};

    dispatch(fetchProducts(searchQuery));
  }, [searchTerm, category, filters, dispatch]);

  // Cambiar página de resultados
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        {/* Cabecera con resultados y filtros activos */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {searchTerm
                ? `Resultados para "${searchTerm}"`
                : "Todos los productos"}
              {category && <span className="text-primary"> en {category}</span>}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1.5 rounded-full">
                {totalProducts}{" "}
                {totalProducts === 1 ? "resultado" : "resultados"}
              </span>
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="md:hidden flex items-center gap-2 text-gray-600 px-4 py-2 rounded-lg hover:text-primary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filtros
              </button>
            </div>
          </div>

          {/* Chips de filtros activos */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-sm text-gray-500">Filtros:</span>
              {activeFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center  text-primary/80 px-3 py-1.5 rounded-full text-sm font-medium hover:text-primary/80 transition-colors"
                >
                  {filter.label}
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="ml-1.5 text-primary/80 hover:text-primary/80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                onClick={clearAllFilters}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center ml-2"
              >
                Limpiar todo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panel de filtros */}
          <aside
            className={`w-full lg:w-72 space-y-4 transition-all duration-300 ${
              filtersVisible ? "block" : "hidden"
            } lg:block`}
          >
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Filtrar productos
              </h3>

              {/* Filtro de ordenamiento */}
              <FilterSection
                title="Ordenar por"
                isOpen={expandedSections.sort}
                onToggle={() => toggleSection("sort")}
              >
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTcyNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em]"
                >
                  {filterOptions.sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Filtro de categoría */}
              <FilterSection
                title="Categoría"
                isOpen={expandedSections.category}
                onToggle={() => toggleSection("category")}
              >
                {categoriesLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : categoriesError ? (
                  <p className="text-red-500 text-sm">
                    Error al cargar categorías
                  </p>
                ) : (
                  <SelectFilter
                    id="category"
                    value={category || "all"}
                    options={categories.map((cat) => ({
                      value: cat.slug,
                      label: cat.name,
                    }))}
                    onChange={(id, value) => {
                      const newParams = new URLSearchParams(searchParams);
                      if (value === "all") {
                        newParams.delete("category");
                      } else {
                        newParams.set("category", value);
                      }
                      navigate({ search: newParams.toString() });
                    }}
                    placeholder="Todas las categorías"
                  />
                )}
              </FilterSection>

              {/* Filtro de tienda */}
              <FilterSection
                title="Tienda"
                isOpen={expandedSections.shop}
                onToggle={() => toggleSection("shop")}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={filters.shopName}
                    onChange={(e) =>
                      handleFilterChange("shopName", e.target.value)
                    }
                    placeholder="Buscar tienda"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </FilterSection>

              {/* Filtro de rango de precios */}
              <FilterSection
                title="Rango de precios"
                isOpen={expandedSections.price}
                onToggle={() => toggleSection("price")}
              >
                <PriceRangeFilter
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </FilterSection>

              {/* Filtro de campus */}
              <FilterSection
                title="Campus"
                isOpen={expandedSections.campus}
                onToggle={() => toggleSection("campus")}
              >
                <SelectFilter
                  id="campus"
                  value={filters.campus}
                  options={filterOptions.campuses}
                  onChange={handleFilterChange}
                  placeholder="Todos los campus"
                  optionValueKey="value"
                  optionLabelKey="label"
                />
              </FilterSection>

              {/* Filtro de características */}
              <FilterSection
                title="Características"
                isOpen={expandedSections.features}
                onToggle={() => toggleSection("features")}
              >
                <div className="space-y-3">
                  <CheckboxFilter
                    id="discount"
                    label="Con descuento"
                    checked={filters.discount}
                    onChange={handleFilterChange}
                  />
                  <CheckboxFilter
                    id="approvedForSale"
                    label="Aprobados para venta"
                    checked={filters.approvedForSale}
                    onChange={handleFilterChange}
                  />
                </div>
              </FilterSection>

              {/* Filtro de rating */}
              <FilterSection
                title="Rating mínimo"
                isOpen={expandedSections.rating}
                onToggle={() => toggleSection("rating")}
              >
                <RatingFilter
                  value={filters.minRating}
                  onChange={handleFilterChange}
                />
              </FilterSection>
            </div>
          </aside>

          {/* Resultados de búsqueda */}
          <section className="flex-1">
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg">
                <p>Error al cargar los productos: {error}</p>
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500 mb-4">
                  Intenta ajustar tus filtros de búsqueda
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 text-primary/80 text-white px-5 py-2.5 rounded-lg hover:text-primary/80 transition-colors"
                >
                  Limpiar filtros
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductItem key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Paginación */}
            {!loading && totalProducts > 10 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  {/* Botón anterior */}
                  {filters.page > 1 && (
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Primera página */}
                  {filters.page > 3 && (
                    <button
                      onClick={() => handlePageChange(1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                        filters.page === 1
                          ? "text-primary/80 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      1
                    </button>
                  )}

                  {/* Indicador de más páginas */}
                  {filters.page > 4 && (
                    <span className="w-10 h-10 flex items-center justify-center">
                      ...
                    </span>
                  )}

                  {/* Números de página alrededor de la actual */}
                  {Array.from(
                    { length: Math.min(5, Math.ceil(totalProducts / 10)) },
                    (_, i) => {
                      let pageNumber;
                      if (filters.page <= 3) {
                        pageNumber = i + 1;
                      } else if (
                        filters.page >=
                        Math.ceil(totalProducts / 10) - 2
                      ) {
                        pageNumber = Math.ceil(totalProducts / 10) - 4 + i;
                      } else {
                        pageNumber = filters.page - 2 + i;
                      }

                      if (
                        pageNumber < 1 ||
                        pageNumber > Math.ceil(totalProducts / 10)
                      )
                        return null;

                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                            filters.page === pageNumber
                              ? "text-primary/80 text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                  {/* Indicador de más páginas */}
                  {filters.page < Math.ceil(totalProducts / 10) - 3 && (
                    <span className="w-10 h-10 flex items-center justify-center">
                      ...
                    </span>
                  )}

                  {/* Última página */}
                  {filters.page < Math.ceil(totalProducts / 10) - 2 && (
                    <button
                      onClick={() =>
                        handlePageChange(Math.ceil(totalProducts / 10))
                      }
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                        filters.page === Math.ceil(totalProducts / 10)
                          ? "text-primary/80 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {Math.ceil(totalProducts / 10)}
                    </button>
                  )}

                  {/* Botón siguiente */}
                  {filters.page < Math.ceil(totalProducts / 10) && (
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </nav>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
