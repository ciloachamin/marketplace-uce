import { useEffect, useState } from "react";
import { FaArrowRight, FaStore, FaSyncAlt, FaWallet } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WalletCard from "../components/WalletCard";
import { Icons } from "../components/Icons";

export default function Wallet() {
  const { currentUser } = useSelector((state) => state.user);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/wallet/user/${currentUser._id}`, {
        credentials: 'include', 
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setWallets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWallets();
  }, [currentUser._id]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Mi Billetera Digital
          </h1>
          <p className="text-center text-gray-500">
            Gestiona tus puntos de fidelidad en un solo lugar
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* QR Code Section */}
          <div className="w-full lg:w-1/3 h-fit">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-black p-4">
                <h2 className="text-xl font-semibold text-white flex items-center justify-center">
                  <FaWallet className="mr-2" size={20} />
                  Mi Código QR
                </h2>
              </div>

              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4 shadow-inner">
                    {/* Contenedor relativo para posicionar el logo */}
                    <div className="relative inline-block">
                      <QRCode
                        value={currentUser._id}
                        size={256}
                        level="H" // Mayor tolerancia a errores para el logo
                        className="rounded" // Opcional: bordes redondeados
                      />
                      {/* Logo centrado */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Icons.cocodrilo_espe_cesta className="w-16 h-16 p-2 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Muestra este código QR en los negocios participantes para
                    acumular puntos
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/shop?sort=recent"
              className="mt-6 flex items-center justify-center bg-white rounded-xl shadow-md p-4 hover:bg-gray-50 transition duration-300"
            >
              <FaStore size={18} className="mr-2 text-primary" />
              <span className=" font-medium">Descubrir negocios</span>
              <FaArrowRight size={16} className="ml-2 " />
            </Link>
          </div>

          {/* Wallets List */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-black p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Mis Puntos por Negocio
                </h2>
                {!loading && wallets.length > 0 && (
                  <button
                    onClick={() => fetchWallets()}
                    className="text-white flex items-center text-sm hover:bg-white/10 p-1 rounded"
                  >
                    <FaSyncAlt size={16} className="mr-1" />
                    Actualizar
                  </button>
                )}
              </div>

              <div className="p-6">
                {loading && (
                  <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}

                {!loading && wallets.length === 0 && !error && (
                  <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <FaWallet className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Aún no tienes puntos
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Visita algún negocio participante y comienza a acumular
                      puntos con tu código QR
                    </p>
                    <Link
                      to="/shop?sort=recent"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white rounded-lg transition"
                    >
                      <FaStore size={16} className="mr-2" />
                      Descubrir negocios participantes
                    </Link>
                  </div>
                )}

                {!loading && wallets.length > 0 && (
                  <div className="grid grid-cols-1 gap-4">
                    {wallets.map((wallet) => (
                      <WalletCard key={wallet._id} wallet={wallet} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
