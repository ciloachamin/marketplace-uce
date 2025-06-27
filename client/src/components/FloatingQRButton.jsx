import { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { ImQrcode } from "react-icons/im";
import { IoMdQrScanner } from "react-icons/io";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { Icons } from "../components/Icons";
import QRScanner from "./QRScanner";

export default function FloatingQRButton() {
  const [showQR, setShowQR] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [showScanner, setShowScanner] = useState(false);

  if (!currentUser) return null;
  const handleShowQR = () => {
    setShowQR(true);
  };

  return (
    <>
      {/* Botón flotante principal - Versión responsive */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col items-end gap-2 sm:gap-3 z-50">
        {/* Botón para usuarios normales (solo muestra QR) */}
        {(currentUser.role === "user" || currentUser.role === "seller") && (
          <button
            onClick={handleShowQR}
            className="bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white p-3 sm:p-4 rounded-full shadow-lg transition-all flex items-center justify-center"
            title="Mostrar mi QR"
            aria-label="Mostrar código QR"
          >
            <ImQrcode className="text-lg sm:text-xl" />
          </button>
        )}

        {/* Botón para negocios (solo escanear) */}
        {currentUser.role === "shop" && (
          <>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-green-700 transition-all flex items-center justify-center"
              title="Escanear QR de cliente"
              aria-label="Escanear código QR"
            >
              <IoMdQrScanner className="text-lg sm:text-xl" />
            </button>
            {showScanner && (
              <QRScanner
                onClose={() => setShowScanner(false)}
                onScan={(data) => console.log("Puntos añadidos:", data)}
              />
            )}
          </>
        )}

        {/* Botón para admin (ambas funcionalidades) */}
        {currentUser.role === "admin" && (
          <>
            <div className="flex flex-col-reverse items-end gap-2 sm:gap-3">
              <button
                onClick={handleShowQR}
                className="bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white p-3 sm:p-4 rounded-full shadow-lg opacity-85 transition-all flex items-center justify-center"
                title="Mostrar mi QR"
                aria-label="Mostrar código QR"
              >
                <ImQrcode className="text-lg sm:text-xl" />
              </button>
              
              <button
                onClick={() => setShowScanner(true)}
                className="bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white p-3 sm:p-4 rounded-full shadow-lg opacity-85 transition-all flex items-center justify-center"
                title="Escanear QR de cliente"
                aria-label="Escanear código QR"
              >
                <IoMdQrScanner className="text-lg sm:text-xl" />
              </button>
            </div>
            
            {showScanner && (
              <QRScanner
                onClose={() => setShowScanner(false)}
                onScan={(data) => console.log("Puntos añadidos:", data)}
              />
            )}
          </>
        )}
      </div>

      {/* Modal del QR - Versión responsive */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:w-1/3 h-fit max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-black p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center justify-center">
                  <FaWallet className="mr-2" size={18} />
                  Mi Código QR
                </h2>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-col items-center">
                  <div className="p-2 sm:p-4 bg-white rounded-lg border border-gray-200 mb-3 sm:mb-4 shadow-inner">
                    <div className="relative inline-block">
                      <QRCode
                        value={currentUser._id}
                        size={window.innerWidth < 640 ? 200 : 256}
                        level="H"
                        className="rounded"
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Icons.cocodrilo_espe_cesta className="w-12 h-12 sm:w-16 sm:h-16 p-1 sm:p-2 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 text-center px-2">
                    Muestra este código QR en los negocios participantes para
                    acumular puntos
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowQR(false)}
                className="mt-4 sm:mt-6 w-full flex items-center justify-center bg-white rounded-xl shadow-md p-3 sm:p-4 hover:bg-gray-50 transition duration-300 mx-auto mb-4 sm:mb-6 max-w-xs"
              >
                <span className="text-sm sm:text-base font-medium">Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}