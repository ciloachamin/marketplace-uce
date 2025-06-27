import React, { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectCoverflow,
  Pagination,
  Navigation,
} from "swiper/modules";
import Card from "./Cards";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./carrucel.css";

const FALLBACK_LIMIT = 6;

const ImageSlider = ({ title, subtitle, href, query }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/product/get?limit=${query.limit ?? FALLBACK_LIMIT}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const map = useMemo(() => {
    if (products && products.length) {
      return products;
    } else if (isLoading) {
      return new Array(query.limit ?? FALLBACK_LIMIT).fill(null);
    }
    return [];
  }, [products, isLoading, query.limit]);

  return (
    <div id="container-carrucel">
      {title && <h1 id="heading-carrucel">{title}</h1>}

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
        id="swiper_container-carrucel"
        // Propiedad corregida para Swiper v9+
        loopedSlides={2} // Reemplaza loopAdditionalSlides
      >
        {map.map((product, i) => (
          <SwiperSlide key={product?._id || `fallback-${i}`} id="swiper-slide-carrucel">
            <Card product={product} index={i} />
          </SwiperSlide>
        ))}
        <div id="slider-controler-carrucel">
          <div className="swiper-button-prev slider-arrow-carrucel"></div>
          <div className="swiper-button-next slider-arrow-carrucel"></div>
        </div>
      </Swiper>
    </div>
  );
};

export default ImageSlider;