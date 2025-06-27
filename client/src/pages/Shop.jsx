import { useEffect, useState } from "react";
import {
  FaClock,
  FaFacebook,
  FaGift,
  FaGlobe,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaShare,
  FaStar,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaUtensils,
  FaSortUp,
  FaHamburger,
  FaIceCream,
  FaWineGlassAlt,
  FaWhatsapp,
  FaCoins,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import MenuCard from "../components/MenuCard";
import WhatsAppButton from "../components/WhatsAppButton";
import MenuDelDiaZaruma from "../components/MenuDelDiaZaruma";

export default function Shop() {
  SwiperCore.use([Navigation]);
  const [shop, setShop] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");
  const [prizesLoading, setPrizesLoading] = useState(true);
  const [prizesError, setPrizesError] = useState(null);
  const [showPrizes, setShowPrizes] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        console.log(`Fetching shop data for ID: ${params.shopId}`);

        const [shopRes, menuRes] = await Promise.all([
          fetch(`/api/shop/get/${params.shopId}`),
          fetch(`/api/menu/${params.shopId}`),
        ]);

        const shopData = await shopRes.json();
        const menuData = await menuRes.json();
        console.log(menuRes);

        console.log(menuData);

        setShop(shopData);
        setMenuData(menuData);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchShop();
  }, [params.shopId]);

  // Fetch prizes for the shop
  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        setPrizesLoading(true);
        const res = await fetch(`/api/prizes/public/${params.shopId}`);
        const data = await res.json();
        console.log(data);

        setPrizes(data.prizes || []);
        if (currentUser) {
          setUserPoints(data.userPoints || 0);
        }
        setPrizesError(null);
      } catch (err) {
        setPrizesError(err.message);
      } finally {
        setPrizesLoading(false);
      }
    };

    if (showPrizes) {
      fetchPrizes();
    }
  }, [params.shopId, showPrizes, currentUser]);

  const togglePrizesSection = () => {
    setShowPrizes(!showPrizes);
  };

  const getSocialMediaIcon = (url) => {
    const domain = url.toLowerCase();
    if (domain.includes("facebook") || domain.includes("fb.com"))
      return <FaFacebook className="text-blue-600" />;
    if (domain.includes("instagram"))
      return <FaInstagram className="text-pink-600" />;
    if (domain.includes("tiktok")) return <FaTiktok className="text-black" />;
    if (domain.includes("twitter") || domain.includes("x.com"))
      return <FaTwitter className="text-blue-400" />;
    if (domain.includes("youtube"))
      return <FaYoutube className="text-red-600" />;
    return <FaGlobe className="text-gray-600" />;
  };

  // Obtener icono según categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case "sopa":
        return <FaSortUp className="inline mr-2" />;
      case "plato_principal":
        return <FaHamburger className="inline mr-2" />;
      case "postre":
        return <FaIceCream className="inline mr-2" />;
      case "bebida":
        return <FaWineGlassAlt className="inline mr-2" />;
      default:
        return <FaUtensils className="inline mr-2" />;
    }
  };

  console.log(shop);

  return (
    <main className="bg-gray-50 min-h-screen">
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-red-500">
              ¡Algo salió mal!
            </h2>
            <p className="mt-2 text-gray-600">
              No pudimos cargar la información de este negocio.
            </p>
          </div>
        </div>
      )}

      {shop && !loading && !error && (
        <div className="pb-10">
          {/* Image Gallery */}
          <div className="relative">
            <Swiper navigation className="h-80 md:h-96 lg:h-[550px]">
              {shop.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${url})` }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-all duration-300"
            >
              <FaShare className="text-gray-700" />
            </button>

            {copied && (
              <div className="absolute top-16 right-4 z-10 bg-white px-4 py-2 rounded-md shadow-md text-sm">
                ¡Enlace copiado!
              </div>
            )}
          </div>

          {/* Shop Details */}
          <div className="max-w-5xl mx-auto -mt-16 relative z-10">
            <div className="bg-white rounded-lg shadow-md p-6 mx-4">
              {/* Header with logo and name */}
              <div className="flex items-center gap-4 mb-6">
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={`${shop.name} logo`}
                    className="w-20 h-20 rounded-full object-cover border shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-500">
                      {shop.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {shop.name}
                  </h1>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {shop.category === "restaurant" && "Restaurante"}
                    {shop.category === "retail" && "Tienda"}
                    {shop.category === "service" && "Servicio"}
                    {shop.category === "other" && "Otro"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Info */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-full">
                      <FaMapMarkerAlt className="text-green-600" />
                    </div>
                    <p className="text-gray-700">{shop.address}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-full">
                      <FaPhone className="text-green-600" />
                    </div>
                    <p className="text-gray-700">{shop.phone}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-full">
                      <FaClock className="text-green-600" />
                    </div>
                    <div className="text-gray-700">
                      <p>
                        Horario: {shop.openingHours} - {shop.closingHours}
                      </p>
                    </div>
                  </div>

                  {shop.socialMedia && shop.socialMedia.length > 0 && (
                    <div className="pt-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Redes Sociales
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {shop.socialMedia.map((social, index) => {
                          const url = social.includes("http")
                            ? social
                            : `https://${social}`;
                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-300"
                            >
                              {getSocialMediaIcon(social)}
                              <span className="text-sm">
                                {social.includes("facebook") && "Facebook"}
                                {social.includes("instagram") && "Instagram"}
                                {social.includes("tiktok") && "TikTok"}
                                {social.includes("twitter") && "Twitter"}
                                {social.includes("youtube") && "YouTube"}
                                {!(
                                  social.includes("facebook") ||
                                  social.includes("instagram") ||
                                  social.includes("tiktok") ||
                                  social.includes("twitter") ||
                                  social.includes("youtube")
                                ) && "Web"}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Sobre nosotros
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {shop.description ||
                      "Este negocio no ha añadido una descripción."}
                  </p>

                  <WhatsAppButton
                    phoneNumber={shop?.phone}
                    message={`Hola.\nUCE SHOP.`}
                    text="Contactar por WhatsApp"
                    autoSend={false}
                    icon={FaWhatsapp}
                    className=" bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black mt-6"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Menus Section */}
          {menuData && shop.category === "restaurant" && (
            <div className="max-w-5xl mx-auto mt-8 px-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                  <FaUtensils className="text-2xl text-green-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Nuestros Menús
                  </h2>
                </div>

                {/* Daily Menus */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Menús del Día
                  </h3>
                  {menuData.dailyMenus && menuData.dailyMenus.length > 0 ? (
                    <div className="space-y-8 max-w-4xl mx-auto">
                      {menuData.dailyMenus
                        .filter((menu) => menu.isActive) // Solo menús activos
                        .map((menu, index) => (
                          <MenuDelDiaZaruma
                            key={index}
                            menu={menu}
                            menuImage={menuData.shopId.imageDailyMenu}
                          />
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No hay menús del día disponibles.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 my-4">
                    Menús Fijos
                  </h3>
                  {menuData.fixedMenus && menuData.fixedMenus.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {menuData.fixedMenus.map((menu, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                        >
                          {/* Encabezado del menú fijo */}
                          <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 text-white">
                            <h2 className="text-2xl font-bold uppercase">
                              {menu.name}
                            </h2>
                            <p className="italic">{menu.description}</p>
                          </div>

                          {/* Contenido del menú fijo */}
                          <div className="p-4">
                            {menu.isImageMenu ? (
                              // Mostrar imagen si es menú de imagen
                              <div className="text-center">
                                <img
                                  src={menu.imageUrl}
                                  alt={`Menú ${menu.name}`}
                                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
                                />
                              </div>
                            ) : (
                              // Mostrar categorías si es menú normal
                              menu.categories.map((category, catIndex) => (
                                <div key={catIndex} className="mb-6">
                                  <h3 className="text-xl font-semibold text-green-700 border-b border-green-200 pb-1 mb-3">
                                    {getCategoryIcon(category.name)}
                                    {category.name}
                                  </h3>
                                  <ul className="space-y-3">
                                    {category.items.map((item, itemIndex) => (
                                      <li
                                        key={itemIndex}
                                        className="flex justify-between items-baseline"
                                      >
                                        <div>
                                          <span className="font-medium text-gray-800">
                                            {item.name}
                                          </span>
                                          {item.description && (
                                            <p className="text-sm text-gray-600 italic">
                                              {item.description}
                                            </p>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <span className="font-bold text-green-700">
                                            ${item.price}
                                          </span>
                                          {item.secondPrice && (
                                            <span className="block text-xs text-gray-500">
                                              ${item.secondPrice}
                                            </span>
                                          )}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No hay menús fijos disponibles.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Prizes Section - Collapsible */}
          <div className="max-w-5xl mx-auto mt-8 px-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Prizes Header with Toggle Button */}
              <button
                onClick={togglePrizesSection}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none transition-all duration-300 hover:bg-green-50 rounded-lg cursor-pointer group border-2 border-transparent hover:border-green-100"
              >
                <div className="flex items-center gap-2">
                  <FaGift className="text-2xl text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Premios del Negocio
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {showPrizes ? (
                    <FaChevronUp className="text-gray-600 transform transition-transform duration-300" />
                  ) : (
                    <FaChevronDown className="text-gray-600 transform transition-transform duration-300 group-hover:-translate-y-1" />
                  )}
                </div>
              </button>

              {/* Collapsible Content - Animated */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  showPrizes ? "max-h-full opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 border-t border-gray-100">
                  {currentUser && (
                    <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full mb-4">
                      <FaCoins className="text-yellow-600" />
                      <span className="font-semibold">
                        Tus puntos: {userPoints}
                      </span>
                    </div>
                  )}
                  {prizesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Cargando premios...</p>
                    </div>
                  ) : prizesError ? (
                    <div className="text-center py-8 text-red-500">
                      Error: {prizesError}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {prizes.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          Este negocio no tiene premios disponibles.
                        </div>
                      ) : (
                        prizes.map((prize) => (
                          <div
                            key={prize._id}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="h-48 bg-gray-100 overflow-hidden">
                              <img
                                src={
                                  prize.image ||
                                  "https://via.placeholder.com/300"
                                }
                                alt={prize.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">
                                  {prize.name}
                                </h3>
                                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                                  <FaCoins className="text-yellow-600" />
                                  <span className="font-semibold">
                                    {prize.pointsRequired}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-4">
                                {prize.description}
                              </p>
                              <div className="text-sm text-gray-500">
                                <p>
                                  Stock:{" "}
                                  {prize.stock === 0
                                    ? "Ilimitado"
                                    : prize.stock}
                                </p>
                              </div>
                            </div>
                            {/* Botón de canjear con condición de autenticación */}
                            <div className="p-4 border-t border-gray-100">
                              {currentUser ? (
                                <button
                                  className={`w-full py-2 px-4 rounded-md font-medium ${
                                    userPoints >= prize.pointsRequired
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  }`}
                                  disabled={userPoints < prize.pointsRequired}
                                >
                                  {userPoints >= prize.pointsRequired
                                    ? "Canjear ahora"
                                    : "Puntos insuficientes"}
                                </button>
                              ) : (
                                <Link
                                  to="/sign-in"
                                  className="block w-full py-2 px-4 text-center bg-primary hover:bg-primary-dark text-white rounded-md font-medium"
                                >
                                  Inicia sesión para canjear
                                </Link>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
