import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css/bundle";
import {
  RiShareFill,
  RiMapPinLine,
  RiStarFill,
  RiArrowLeftLine,
  RiShoppingBag3Line,
  RiStore2Line,
  RiCheckboxCircleFill,
  RiTimeLine,
  RiInformationLine,
  RiPhoneLine,
} from "react-icons/ri";
import Contact from "../components/Contact";
import Reviews from "../components/Reviews";
import Loading from "../components/Loadings";
import WhatsAppButton from "../components/WhatsAppButton";
import { FaWhatsapp } from "react-icons/fa";

export default function Product() {
  SwiperCore.use([Navigation, Pagination, Thumbs]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/get/${params.productId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setProduct(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.productId]);

  // Calculate final price after discount
  const finalPrice =
    product &&
    (product.discount > 0 ? product.price - product.discount : product.price);

  // Format price to USD
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <main className="bg-white min-h-screen">
      {loading && <Loading></Loading>}

      {error && (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center p-8">
            <RiInformationLine
              size={48}
              className="text-red-500 mx-auto mb-4"
            />
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              Algo salió mal
            </h2>
            <p className="text-gray-600">
              No pudimos cargar los detalles del producto. Inténtalo de nuevo
              más tarde.
            </p>
          </div>
        </div>
      )}

      {product && !loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb navigation */}
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-500 hover:text-indigo-600 transition"
            >
              <RiArrowLeftLine className="mr-2" />
              <span>Volver a productos</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Product Gallery */}
            <div className="lg:w-1/2">
              {/* Main Swiper */}
              <div className="relative mb-4">
                <Swiper
                  spaceBetween={0}
                  navigation
                  pagination={{ clickable: true }}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  className="rounded-xl overflow-hidden"
                  style={{ height: "500px" }}
                >
                  {product.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="h-full w-full bg-gray-100"
                        style={{
                          background: `url(${url}) center center no-repeat`,
                          backgroundSize: "contain",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Share button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition duration-200"
                  aria-label="Share product"
                >
                  <RiShareFill className="text-gray-700" />
                </button>

                {copied && (
                  <div className="absolute top-16 right-4 z-10 bg-gray-800 text-white text-xs px-3 py-1.5 rounded opacity-90">
                    Link copiado!
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.imageUrls.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  watchSlidesProgress={true}
                  className="thumbs-swiper"
                >
                  {product.imageUrls.map((url, index) => (
                    <SwiperSlide
                      key={index}
                      className="cursor-pointer rounded-lg overflow-hidden h-24 border border-gray-200"
                    >
                      <div
                        className="h-full w-full"
                        style={{
                          background: `url(${url}) center center no-repeat`,
                          backgroundSize: "cover",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="lg:w-1/2">
              {/* Category & Brand */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500">
                  {product.category}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{product.brand}</span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating & Location */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-sm">
                  {[...Array(5)].map((_, i) => (
                    <RiStarFill
                      key={i}
                      className={
                        i < product.rating ? "text-yellow-400" : "text-gray-300"
                      }
                      size={18}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating > 0 ? `${product.rating}.0` : "No ratings"}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <RiMapPinLine className="mr-1 text-gray-400" />
                  <span>{product.campus}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end">
                  <span className="text-3xl font-bold">
                    {formatPrice(finalPrice)}
                  </span>

                  {product.discount > 0 && (
                    <div className="ml-3 flex flex-col">
                      <span className="text-gray-500 line-through text-lg">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-green-600 text-sm font-medium">
                        Ahorrar {formatPrice(product.discount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Stock */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                    product.approvedForSale
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {product.approvedForSale ? (
                    <RiCheckboxCircleFill className="mr-1.5" />
                  ) : (
                    <RiTimeLine className="mr-1.5" />
                  )}
                  {product.approvedForSale
                    ? "Approved for Sale"
                    : "Pending Approval"}
                </div>

                <div
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                    product.stock > 0 ? "bg-blue-50 " : "bg-red-50 text-red-700"
                  }`}
                >
                  <RiShoppingBag3Line className="mr-1.5" />
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Descripción
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Shop info */}
              {product.userRef && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Información del vendedor
                  </h3>
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <img
                      src={
                        product.userRef.avatar ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="Seller"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">
                        {product.userRef.name} {product.userRef.lastname}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.shopName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Button */}
              {product.userRef && (
                <WhatsAppButton
                  phoneNumber={product?.userRef?.phone}
                  message={`Hola,\nDeseo Adquirir:\n${product?.name}- $: ${product?.price}.\UCE SHOP.`}
                  text="Confirmar pedido"
                  autoSend={false}
                  icon={FaWhatsapp} // Pasa un ícono
                  className=" bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black"
                />
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <div className="border-b border-gray-200 pb-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Reseñas de clientes
              </h2>
            </div>
            <Reviews product={product} />
          </div>
        </div>
      )}
    </main>
  );
}
