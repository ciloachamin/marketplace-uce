import React, { useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webm'

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`/api/banner/get`, {
          credentials: 'include', 
        });
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        console.log(data);
        
        setBanners(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;
  console.log('banners',banners);
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className=""
      >
        {/* Static video slide */}
        <SwiperSlide>
          <video
            autoPlay
            loop
            muted
            playsInline
            width="1920"
            height="420"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          >
            <source src={logo} type="video/webm" />
            Tu navegador no soporta el formato de vídeo.
          </video>
        </SwiperSlide>

        {/* Dynamic banners from API */}

        {banners.map((banner) => (

            
          <SwiperSlide key={banner._id}>
            <Link 
              to={banner.linkUrl || `/shop/${banner.shopRef}`} 
              aria-label={`Más información sobre ${banner.name}`}
            >
              <img
                src={`${banner.imageUrl}`}
                alt={banner.altText}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '544px',
                  objectFit: 'cover'
                }}
                loading="eager"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default BannerSlider;