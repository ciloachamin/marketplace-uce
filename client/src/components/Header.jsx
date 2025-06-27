import { useEffect, useState } from "react";
import { FaList, FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import HeaderTop from "./HeaderTop";
import { Icons } from "./Icons";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { fetchCategories } from "../redux/reducers/categorySlice";
import RoleProtectedElement from "./RoleProtectedElement";
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
import { app } from "../firebase";
import NavItems from "./NavItems";
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categoryShow, setCategoryShow] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar categorías al montar el componente
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Manejar búsqueda
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (searchTerm) urlParams.set("searchTerm", searchTerm);
    if (category) urlParams.set("category", category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setMobileSearchOpen(false);
  };

  // Restaurar términos de búsqueda desde URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
    if (categoryFromUrl) setCategory(categoryFromUrl);
  }, [location.search]);

  // Manejar cierre de sesión
  const handleSignOut = async () => {
    try {
      setShowDropdown(false);
      setMobileMenuOpen(false);
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      console.log(data);
      
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      const auth = getAuth(app);
      await firebaseSignOut(auth);
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".user-dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Datos del menú
  const Menu = [
    { id: 1, name: "Inicio", link: "/" },
    { id: 2, name: "Blog", link: "/blog" },
    { id: 3, name: "Premios", link: "/wallet-info" },
    // { id: 4, name: "Fiestas", link: "/fiestas" },
    // { id: 5, name: "Contacto", link: "/contacto" },
  ];

  const DropDownLink = [
    { id: 1, name: "Populares", link: "/trending/populares" },
    { id: 2, name: "Novedades", link: "/trending/novedades" },
    { id: 3, name: "Destacados", link: "/trending/destacados" },
    { id: 4, name: "Ofertas", link: "/trending/ofertas" },
    { id: 5, name: "Recomendados", link: "/trending/recomendados" },
  ];

  return (
    <header className="shadow-md bg-white dark:bg-gray-900 dark:text-slate-300 duration-200">
      <HeaderTop />
      
      {/* Barra principal */}
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 relative">
        {/* Logo */}
        <div className="flex items-center gap-4">
          {/* Botón menú móvil */}
          <button 
            className="lg:hidden text-xl p-2 focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          {/* Logo */}
          <div className="h-12 w-20 flex items-center">
            <Link to="/">
              <Icons.logo className="w-full h-full object-contain dark:fill-slate-300" />
            </Link>
          </div>
        </div>
        
        {/* Menú de navegación - Desktop */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-6">
            {Menu.map((data) => (
              <li key={data.id}>
                <Link 
                  className="inline-block px-3 py-2 font-medium hover:text-primary transition-colors" 
                  to={data.link}
                >
                  {data.name}
                </Link>
              </li>
            ))}
            
            {/* Dropdown */}
            {/* <li className="group relative cursor-pointer">
              <a href="#" className="flex items-center gap-1 px-3 py-2 font-medium">
                Trending
                <span>
                  <MdOutlineKeyboardArrowDown className="transition-all duration-200 group-hover:rotate-180" />
                </span>
              </a>
              <div className="absolute z-50 hidden group-hover:block w-48 rounded-md bg-white p-2 text-black shadow-lg dark:bg-gray-800 dark:text-white">
                <ul className="py-1">
                  {DropDownLink.map((data) => (
                    <li key={data.id}>
                      <Link
                        className="block w-full rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        to={data.link}
                      >
                        {data.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li> */}
          </ul>
        </nav>

        {/* Acciones del usuario & Iconos */}
        <div className="flex items-center gap-4">
          {/* Botón de búsqueda móvil */}
          <button 
            className="lg:hidden text-lg p-2" 
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <FaSearch />
          </button>
          
          {/* Usuario / Login */}
          <div className="user-dropdown relative">
            {currentUser ? (
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-sm font-medium py-1 px-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <img
                  className="rounded-full h-8 w-8 object-cover border dark:border-gray-700"
                  src={currentUser.avatar}
                  alt="profile"
                />
                <span className="hidden sm:inline">{currentUser.name}</span>
                <MdOutlineKeyboardArrowDown className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link to="/sign-in" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <FaUser />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </Link>
            )}
            
            {/* Dropdown del usuario */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 py-2 bg-white rounded-md shadow-xl z-50 dark:bg-gray-800 border dark:border-gray-700">
                <div className="px-4 py-2 border-b dark:border-gray-700">
                  <p className="font-medium">{currentUser.name + " " + currentUser.lastname}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                </div>
                
                <RoleProtectedElement allowedRoles={["admin", "seller", "shop"]}>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                </RoleProtectedElement>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Perfil
                </Link>

                <RoleProtectedElement allowedRoles={["user", "admin", "seller"]}>
                  <Link
                    to="/wallet"
                    className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Billetera
                  </Link>
                </RoleProtectedElement>

                <RoleProtectedElement allowedRoles={["shop", "admin"]}>
                  <Link
                    to="/qr-scanner"
                    className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Escanear QR
                  </Link>
                </RoleProtectedElement>

                <div className="border-t dark:border-gray-700 mt-1"></div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Link to="/" className="block w-16">
                <Icons.logo className="w-full" />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-lg"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-1">
              {Menu.map((data) => (
                <li key={data.id}>
                  <Link 
                    className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    to={data.link}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {data.name}
                  </Link>
                </li>
              ))}
              
              {/* Dropdown en menú móvil */}
              {/* <li className="block">
                <details className="group">
                  <summary className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    Trending
                    <MdOutlineKeyboardArrowDown className="transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="pl-6 mt-1 space-y-1">
                    {DropDownLink.map((data) => (
                      <li key={data.id}>
                        <Link
                          className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          to={data.link}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {data.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li> */}
            </ul>
            
            {/* Contacto en móvil */}
            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex bg-primary/10 text-primary justify-center items-center">
                  <IoIosCall />
                </div>
                <div>
                  <h2 className="font-medium">+593 98 353 7312</h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Soporte 24/7</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Búsqueda móvil */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
          mobileSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileSearchOpen(false)}
      >
        <div 
          className={`fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileSearchOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Buscar</h3>
              <button 
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-slate-600 dark:text-slate-300 outline-none focus:border-primary"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              
              <div className="relative">
                <input
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 pl-10 text-slate-600 dark:text-slate-300 outline-none focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="¿Qué necesitas?"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white font-medium py-2 rounded-md transition-colors"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y categorías - Desktop */}
      <div className="hidden lg:block container mx-auto pb-4">
        {loading && <div className="text-center py-2">Cargando categorías...</div>}
        {error && <div className="text-red-500 text-center py-2">{error}</div>}
        
        <div className="flex gap-4">
          {/* Lista de categorías */}
          <div className="w-3/12">
            <div className="bg-white dark:bg-gray-900 relative">
              <div
                onClick={() => setCategoryShow(!categoryShow)}
                className="h-12 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white flex justify-between items-center px-4 rounded-t-md font-medium cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FaList />
                  <span>Todas las categorías</span>
                </div>
                <MdOutlineKeyboardArrowDown className={`transition-transform duration-200 ${categoryShow ? '' : 'rotate-180'}`} />
              </div>
              
              <div
                className={`${
                  categoryShow ? "h-0" : "h-80"
                } overflow-hidden transition-all duration-300 absolute z-50 w-full border rounded-b-md dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg`}
              >
                <ul className="py-2 text-slate-600 dark:text-slate-300 h-full overflow-auto">
                  {categories.map((c) => (
                    <li
                      key={c._id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={c.image}
                        className="w-8 h-8 rounded-full object-cover border dark:border-gray-700"
                        alt={c.name}
                      />
                      <Link
                        to={`/search?category=${c.slug}`}
                        className="block"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda y contacto */}
          <div className="w-9/12">
            <div className="flex gap-4">
              {/* Barra de búsqueda */}
              <div className="w-8/12">
                <form onSubmit={handleSubmit} className="flex h-12 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
                  <div className="relative border-r border-gray-300 dark:border-gray-600">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-40 h-full bg-transparent px-3 text-slate-600 dark:text-slate-300 outline-none appearance-none"
                    >
                      <option value="">Categoría</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <MdOutlineKeyboardArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  
                  <input
                    className="flex-1 px-4 bg-transparent text-slate-600 dark:text-slate-300 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="¿Qué necesitas?"
                  />
                  
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white font-medium px-6 transition-colors"
                  >
                    Buscar
                  </button>
                </form>
              </div>
              
              {/* Contacto */}
              <div className="w-4/12">
                <div className="h-full flex justify-end items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-12 h-12 rounded-full flex bg-primary/10 text-primary justify-center items-center">
                    <IoIosCall className="text-xl" />
                  </div>
                  <div>
                    <h2 className="font-medium">+593 98 353 7312</h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Soporte 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NavItems></NavItems>
    </header>
  );
}