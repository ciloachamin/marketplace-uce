import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./MenuCarousel.css";
import MenuDelDiaZaruma from "./MenuDelDiaZaruma";
import {
  FaHamburger,
  FaIceCream,
  FaSortUp,
  FaUtensils,
  FaWineGlassAlt,
} from "react-icons/fa";

const MenuCarousel = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/menu/", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch menus");
        }
        const data = await response.json();
        const processedMenus = [
          ...data.flatMap((shop) =>
            shop.dailyMenus.map((menu) => ({
              ...menu,
              type: "daily",
              shop: shop,
            }))
          ),
          ...data.flatMap((shop) =>
            shop.fixedMenus.map((menu) => ({
              ...menu,
              type: "fixed",
              shop: shop,
            }))
          ),
        ].filter((menu) => menu.isActive !== false);

        setMenus(processedMenus);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  console.log("Menus fetched:", menus);
  

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

  if (loading) return <div className="loading-menus">Cargando menús...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (menus.length === 0)
    return <div className="no-menus">No hay menús disponibles</div>;

  return (
    <div className="menu-carousel-container">
      {/* Header Section */}
      <div className="text-center mt-16 mb-4">
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white"
        >
          Menús disponibles
        </h2>
      </div>
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        loop={menus.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {menus.map((menu) => (
          <SwiperSlide key={`${menu._id}-${menu.type}`}>
            <div className="menu-card">
              {/* Encabezado del menú fijo */}
              <div className="bg-gradient-to-b from-primary to-black p-4 text-white">
                <h2 className="text-2xl font-bold uppercase">{menu.shop.shopId.name}</h2>
                <p className="italic">{menu.description}</p>
              </div>
              {menu.type === "daily" ? (
                <div className="daily-menu-container">
                  <MenuDelDiaZaruma
                    menu={menu}
                    menuImage={menu.shop.shopId.imageDailyMenu}
                  />
                </div>
              ) : (
                <div className="fixed-menu-container">
                  {menu.isImageMenu ? (
                    <div className="image-menu-fullwidth">
                      <img
                        src={menu.imageUrl}
                        alt={`Menú ${menu.name}`}
                        className="menu-image-full"
                      />
                    </div>
                  ) : (
                    <div className="fixed-menu-content">
                      <div className="menu-header">
                        <h3 className="menu-title">{menu.name}</h3>
                        <p className="menu-description">{menu.description}</p>
                      </div>
                      {menu.categories?.map((category, catIndex) => (
                        <div key={catIndex} className="menu-category">
                          <h4 className="category-title">
                            {getCategoryIcon(category.name)}
                            {category.name}
                          </h4>
                          <ul className="menu-items-list">
                            {category.items?.map((item, itemIndex) => (
                              <li key={itemIndex} className="menu-item">
                                <div className="item-info">
                                  <span className="item-name">{item.name}</span>
                                  {item.description && (
                                    <p className="item-description">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="item-prices">
                                  <span className="main-price">
                                    ${item.price}
                                  </span>
                                  {item.secondPrice && (
                                    <span className="secondary-price">
                                      ${item.secondPrice}
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MenuCarousel;
