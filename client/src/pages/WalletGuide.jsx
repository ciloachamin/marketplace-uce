import { useState } from 'react';
import {
  FaCoins,
  FaGift,
  FaHistory,
  FaMedal,
  FaQrcode,
  FaShoppingBag,
  FaStore,
  FaUserPlus
} from "react-icons/fa";
import { MdLocationOn, MdPayments } from "react-icons/md";
import { RiCoupon3Fill, RiQrCodeLine, RiQrScanLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

export default function WalletExplained() {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [puntos, setPuntos] = useState(250);
  
  const handleAddPoints = () => {
    setPuntos(prev => prev + 25);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Billetera de Puntos Digital</h1>
          <p className="text-xl mb-8">
            La manera más fácil de acumular y canjear puntos de fidelidad
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setActiveTab('usuarios')} 
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'usuarios' 
                  ? 'bg-white text-gray-900' 
                  : 'bg-black bg-opacity-30 border border-white hover:bg-opacity-50'
              }`}
            >
              <FaQrcode className="mr-2" /> Para Usuarios
            </button>
            <button 
              onClick={() => setActiveTab('negocios')} 
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'negocios' 
                  ? 'bg-white text-gray-900' 
                  : 'bg-black bg-opacity-30 border border-white hover:bg-opacity-50'
              }`}
            >
              <FaStore className="mr-2" /> Para Negocios
            </button>
          </div>
        </div>
      </div>

      {/* Explicación para usuarios */}
      {activeTab === 'usuarios' && (
        <>
          {/* Cómo funciona para usuarios */}
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              ¿Cómo funciona para los usuarios?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Paso 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-gradient-to-r from-primary to-black w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Obtén tu QR</h3>
                <p className="text-gray-600">
                  Regístrate para recibir tu código QR personal único que te identifica en el sistema.
                </p>
              </div>

              {/* Paso 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-gradient-to-r from-primary to-black w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Muestra tu QR</h3>
                <p className="text-gray-600">
                  Cuando compres en negocios afiliados, muestra tu QR para que lo escaneen y sumen puntos a tu cuenta.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-gradient-to-r from-primary to-black w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Canjea beneficios</h3>
                <p className="text-gray-600">
                  Usa los puntos acumulados para obtener descuentos, productos gratis o promociones exclusivas.
                </p>
              </div>
            </div>
          </div>

          {/* Beneficios para usuarios */}
          <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Beneficios para Usuarios</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-primary to-black p-3 rounded-lg text-white mr-4">
                    <FaCoins size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Acumula puntos automáticamente
                    </h3>
                    <p className="text-gray-600">
                      Gana puntos con cada compra en los negocios afiliados sin necesidad de llevar tarjetas físicas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-primary to-black p-3 rounded-lg text-white mr-4">
                    <RiCoupon3Fill size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Promociones personalizadas
                    </h3>
                    <p className="text-gray-600">
                      Recibe ofertas especiales basadas en tus hábitos de compra y preferencias.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-primary to-black p-3 rounded-lg text-white mr-4">
                    <FaHistory size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Historial transparente
                    </h3>
                    <p className="text-gray-600">
                      Consulta el historial completo de tus puntos ganados y canjeados, con detalles de cada transacción.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Simulador de QR */}
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              Tu Billetera Digital
            </h2>
            
            <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-primary to-black text-white p-6 text-center">
                <div className="inline-block rounded-full bg-white p-3 mb-4">
                  <FaQrcode size={32} className="text-black" />
                </div>
                <h3 className="text-xl font-bold">Tus Puntos Actuales</h3>
                <p className="text-3xl font-bold mt-2">{puntos}</p>
              </div>
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="border-4 border-gray-800 p-4 rounded-lg">
                    <RiQrCodeLine size={180} />
                  </div>
                </div>
                <p className="text-center text-gray-600 mb-6">
                  Este es tu código QR personal. Preséntalo en los negocios afiliados para acumular puntos.
                </p>
                <button 
                  onClick={handleAddPoints}
                  className="w-full bg-gradient-to-r from-primary to-black text-white py-3 rounded-lg hover:to-primary hover:from-black transition-all"
                >
                  <RiQrScanLine className="inline-block mr-2" /> Simular escaneo de puntos
                </button>
              </div>
            </div>
          </div>

          {/* Premios disponibles */}
          <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Ejemplo de premios disponibles
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Premio 1 */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="bg-gradient-to-r from-primary to-black h-48 flex items-center justify-center text-white">
                    <FaGift size={64} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Descuento del 15%</h3>
                    <p className="text-gray-600 mb-4">100 puntos</p>
                    <button className="w-full bg-gradient-to-r from-primary to-black text-white py-2 rounded-lg hover:to-primary hover:from-black transition-all">
                      Canjear
                    </button>
                  </div>
                </div>

                {/* Premio 2 */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="bg-gradient-to-r from-primary to-black h-48 flex items-center justify-center text-white">
                    <FaGift size={64} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Envío gratuito</h3>
                    <p className="text-gray-600 mb-4">75 puntos</p>
                    <button className="w-full bg-gradient-to-r from-primary to-black text-white py-2 rounded-lg hover:to-primary hover:from-black transition-all">
                      Canjear
                    </button>
                  </div>
                </div>

                {/* Premio 3 */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="bg-gradient-to-r from-primary to-black h-48 flex items-center justify-center text-white">
                    <FaGift size={64} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Producto gratuito</h3>
                    <p className="text-gray-600 mb-4">200 puntos</p>
                    <button className="w-full bg-gradient-to-r from-primary to-black text-white py-2 rounded-lg hover:to-primary hover:from-black transition-all">
                      Canjear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Explicación para negocios */}
      {activeTab === 'negocios' && (
        <>
          {/* Cómo funciona para negocios */}
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              ¿Cómo funciona para los negocios?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Paso 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-gradient-to-r from-primary to-black w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Afíliate al sistema</h3>
                <p className="text-gray-600">
                  Regístrate como negocio afiliado y configura los puntos que otorgarás por cada compra.
                </p>
              </div>

              {/* Paso 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-gradient-to-r from-primary to-black w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Escanea códigos QR</h3>
                <p className="text-gray-600">
                  Utiliza nuestra aplicación para escanear los códigos QR de tus clientes y otorgarles puntos.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-gradient-to-r from-primary to-black w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Crear promociones</h3>
                <p className="text-gray-600">
                  Define los beneficios que ofrecerás a cambio de puntos y gestiona tus promociones.
                </p>
              </div>
            </div>
          </div>

          {/* Beneficios para negocios */}
          <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Beneficios para Negocios</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-primary to-black p-3 rounded-lg text-white mr-4">
                    <FaShoppingBag size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Aumenta la fidelidad de clientes
                    </h3>
                    <p className="text-gray-600">
                      Incentiva a tus clientes a regresar frecuentemente para acumular y canjear puntos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-primary to-black p-3 rounded-lg text-white mr-4">
                    <MdPayments size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Incrementa tus ventas
                    </h3>
                    <p className="text-gray-600">
                      Los programas de fidelización han demostrado aumentar el gasto promedio por cliente y la frecuencia de compra.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-primary to-black p-3 rounded-lg text-white mr-4">
                    <MdLocationOn size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Atrae nuevos clientes
                    </h3>
                    <p className="text-gray-600">
                      Forma parte de una red de negocios que los usuarios consultan cuando buscan dónde gastar sus puntos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de negocio */}
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              Panel de Control para Negocios
            </h2>
            
            <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-primary to-black text-white p-6">
                <h3 className="text-xl font-bold">Herramientas para tu negocio</h3>
                <p className="mt-2">Todo lo que necesitas para gestionar el programa de fidelización</p>
              </div>
              
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-center mb-4">
                      <RiQrScanLine size={24} className="text-primary mr-3" />
                      <h4 className="font-semibold">Escáner de QR</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Escanea fácilmente los códigos QR de tus clientes para otorgarles puntos por sus compras.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-center mb-4">
                      <FaCoins size={24} className="text-primary mr-3" />
                      <h4 className="font-semibold">Gestión de Puntos</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Define cuántos puntos otorgar según el valor de la compra o por productos específicos.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-center mb-4">
                      <FaGift size={24} className="text-primary mr-3" />
                      <h4 className="font-semibold">Crear Promociones</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Establece los beneficios que ofrecerás a cambio de puntos y las condiciones para canjearlos.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-center mb-4">
                      <FaMedal size={24} className="text-primary mr-3" />
                      <h4 className="font-semibold">Análisis de Clientes</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Monitorea estadísticas sobre el uso de puntos y la efectividad de tus promociones.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link to='/sign-up' className="w-full p-14 bg-gradient-to-r from-primary to-black text-white py-3 rounded-lg hover:to-primary hover:from-black transition-all">
                    Registra tu negocio ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8">
            Únete a nuestra billetera de puntos y comienza a disfrutar de todos los beneficios
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to='/sign-in' className="px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-opacity-90 transition-all">
              <FaUserPlus className="inline-block mr-2" /> Inicia sesión
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}