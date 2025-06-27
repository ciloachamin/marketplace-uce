import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import BannerSlider from "../components/BannerSlider";
import ImageSlider from "../components/ImageSlider";
import ProductReel from "../components/ProductReel";
import ShopReel from "../components/ShopReel ";
import TopProducts from "../components/TopProducts";
import MenuCarousel from "../components/MenuCarousel";

export default function Home() {
  SwiperCore.use([Navigation]);
  return (
    <div>
      <div className="mx-auto w-full max-w-screen-2xl py-1">
        <BannerSlider />
      </div>
      <div className="px-2.5 md:px-20 mx-auto w-full max-w-screen-2xl">
        <div className=" mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground sm:text-6xl">
            Tu plataforma exclusiva para{" "}
            <span className="text-primary">emprendedores universitarios</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Libera tu potencial emprendedor con nosotros. Proporcionamos
            recursos, conexiones y eventos exclusivos para estudiantes como
            usted. ¡Haz crecer tus ideas con nuestra comunidad!
          </p>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Tenemos Envios a distintas sedes de la Universidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white h-10 px-4 py-2"
              aria-label="Ver Productos"
              to="/search"
            >
              Ver Productos
            </Link>
            <Link
              aria-label="¿Quieres vender?"
              to="/seller-plan"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
            >
              ¿Quieres vender? &rarr;
            </Link>

            <Link
              aria-label="Ver Trabaja con nosotros"
              to="https://api.whatsapp.com/send/?phone=5930983537312"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2 sm:mt-0"
            >
              Trabaja con nosotros&rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="px-2.5 md:px-20 mx-auto w-full max-w-screen-2xl">
        <MenuCarousel />
        <ImageSlider query={{ limit: 10 }} />
        <ShopReel
          query={{ limit: 10 }}
          href="/shop?sort=recent"
          title="Negocios Nuevos"
        />
        <TopProducts />
        <ProductReel
          query={{ limit: 5 }}
          href="/product?sort=recent"
          title="Productos Nuevos"
        />
      </div>
    </div>
  );
}
