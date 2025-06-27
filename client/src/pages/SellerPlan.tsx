import React from 'react';
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import PricingCard from '../components/PricingCard'
import Accordion from '../components/Accordion'

const SellerPlan = ({ }) => {
    return (
        <div className="max-w-6xl mx-auto p-4">

            <div className='py-20 mx-auto text-center flex flex-col items-center max-w-3xl'>
                <h1 className='text-4xl font-bold tracking-tight text-secondary-foreground sm:text-6xl'>
                    El mercado para grandes {' '}
                    <span className='text-primary'>
                        emprendedores
                    </span>
                    .
                </h1>
                <p className='mt-6 text-lg max-w-prose text-muted-foreground'>
                    Bienvenido a UCE SHOP. Aquí entendemos que grandes emprendedores como tú merecen una plataforma que te brinde las herramientas para tener éxito.
                </p>
            </div>
            <div className='w-full flex justify-center items-center self-center flex-col'>

                <Accordion title="¿Qué es un Plan de Vendedor?">
                    <p>
                        Un plan de vendedor es una suscripción que te permite vender tus productos en nuestra plataforma. Puedes elegir entre 3 planes diferentes.
                    </p>
                </Accordion>
                <Accordion title="¿Por qué necesito un plan?">
                    <p>
                        Se requiere un plan de vendedor para vender tus productos en nuestra plataforma. Esto es para garantizar que podamos brindar un servicio de alta calidad a nuestros clientes.
                    </p>
                </Accordion>
                <Accordion title="¿Qué sucede si cancelo mi plan?">
                    <p>
                        Si cancelas tu plan, tus productos ya no estarán disponibles para la venta. Aún podrás acceder a tu cuenta y comprar productos. Tus productos permaneceran en nuestra base de datos, pero no estarán disponibles para la venta. Hasta que vuelvas a comprar un plan.
                    </p>
                </Accordion>
            </div>

            <div className='flex gap-5 my-10  max-lg:flex-col'>
                <h2 className='mt-10 text-3xl font-bold tracking-tight text-secondary-foreground sm:text-5xl text-center'>Compra uno de nuestros planes</h2>

                <PricingCard
                    title="Inicio"
                    description=" Ideal para nuevos vendedores o aquellos con pocos productos y venta no muy frecuente. Una forma económica y efectiva de dar tus primeros pasos en el comercio digital."
                    promo='Gratis '
                    price="$0"
                    time='Mes'
                    features={[
                        'Cuenta de vendedor para subir y gestionar productos',
                        'Soporte técnico para el uso de la plataforma',
                        'Configuración individual de productos',
                    ]}
                    buttonText="Comenzar"
                    buttonNumber='0983537312'
                    buttonMessage='Hola, quiero comprar el plan Inicio'
                />
                <PricingCard
                    title="Vendedor Básico"
                    description="Diseñado para vendedores con un mercado ya establecido o que manejan un catálogo variado de productos. Este plan te ayudará a expandir tu presencia y alcanzar a más clientes dentro de UCE Shop."
                    promo='Gratis 10 Días'
                    price="$2"
                    time='Mes'
                    features={[
                        'Cuenta de vendedor para subir y gestionar productos',
                        'Soporte técnico para el uso de la plataforma',
                        'Configuración individual de productos',
                        'Colocación prioritaria en la plataforma principal',
                        'Publicidad en Redes Sociales de UCE Shop'
                    ]}
                    buttonText="Comenzar"
                    buttonNumber='0983537312'
                    buttonMessage='Hola, quiero comprar el plan vendedor básico.'
                />
                <PricingCard
                    title="Vendedor Premium"
                    description="La opción definitiva para aquellos que desean llevar su negocio al siguiente nivel. Obtén tu propia página web independiente, gestionada desde UCE Shop, y vende tus productos más allá de nuestra plataforma."
                    promo='En desarrollo'
                    price="$30"
                    time='Semestral'
                    features={[
                        'Cuenta de vendedor para subir y gestionar productos',
                        'Soporte técnico para el uso de la plataforma',
                        'Configuración individual de productos',
                        'Colocación prioritaria en la plataforma principal',
                        'Página de destino personalizable que muestra tus productos para clientes externos',
                        'Publicidad en Redes Sociales de UCE Shop'

                    ]}
                    buttonText="Comenzar"
                    buttonNumber='0983537312'
                    buttonMessage='Hola, quiero comprar el plan vendedor premium. ¿Qué implica este plan?'

                />
                <div>
                </div>
            </div>
        </div >
    )
}

export default SellerPlan
