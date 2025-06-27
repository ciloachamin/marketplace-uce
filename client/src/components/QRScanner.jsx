import { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useSelector } from "react-redux";
import {
  IoMdQrScanner,
  IoMdClose,
  IoMdCheckmark,
  IoMdArrowForward,
  IoMdInformation,
  IoMdAdd,
  IoMdRemove,
} from "react-icons/io";

export default function QRScanner({ onClose, onScan }) {
  const { currentUser } = useSelector((state) => state.user);
  const [points, setPoints] = useState(10);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [scannedUserId, setScannedUserId] = useState(null);

  const handleQuickPoints = (value) => {
    setPoints(value);
  };

  const handleAddPoints = async () => {
    if (!scannedUserId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/wallet/add-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: scannedUserId,
          points: points,
          description:
            description || `Puntos añadidos por ${currentUser.username}`,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
      } else {
        setSuccess(`Se añadieron ${points} puntos exitosamente`);
        setTimeout(() => {
          onScan(data);
          onClose();
        }, 1500);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const incrementPoints = () => {
    setPoints(prev => prev + 1);
  };

  const decrementPoints = () => {
    setPoints(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="w-full max-w-md mx-2 sm:mx-4 lg:w-1/3 h-fit max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-black p-3 sm:p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <IoMdQrScanner className="mr-2" size={20} />
                <h2 className="text-lg sm:text-xl font-semibold">Escanear QR</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Cerrar escáner"
              >
                <IoMdClose size={20} />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-4 sm:p-6">
            {!scannedUserId ? (
              <div className="space-y-3 sm:space-y-4">
                {/* Scanner */}
                <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner aspect-square">
                  <QrScanner
                    onResult={(result) => {
                      if (result) {
                        setScannedUserId(result?.text);
                      }
                    }}
                    constraints={{ facingMode: "environment" }}
                    containerStyle={{ width: "100%", height: "100%" }}
                    videoStyle={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(error) => setError(error?.message)}
                  />
                </div>

                {/* Info */}
                <div className="flex items-start p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <IoMdInformation className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-600">
                    Posiciona el código QR del cliente dentro del marco para añadir
                    puntos a su cuenta
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {/* Success message */}
                <div className="flex items-center justify-center p-2 sm:p-3 bg-green-50 rounded-lg">
                  <IoMdCheckmark className="text-green-600 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-green-700">
                    Código QR escaneado correctamente
                  </span>
                </div>

                {/* Quick points selection */}
                <div className="space-y-3">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Selección rápida de puntos
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleQuickPoints(value)}
                        className={`py-3 rounded-lg font-medium transition-all ${
                          points === value
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom points input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Puntos personalizados
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={decrementPoints}
                      className="p-2 bg-gray-100 rounded-l-lg border border-r-0 border-gray-200 hover:bg-gray-200 transition-colors"
                    >
                      <IoMdRemove />
                    </button>
                    <input
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                      className="w-full p-2 sm:p-3 border border-gray-200 text-center font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      min="1"
                    />
                    <button
                      onClick={incrementPoints}
                      className="p-2 bg-gray-100 rounded-r-lg border border-l-0 border-gray-200 hover:bg-gray-200 transition-colors"
                    >
                      <IoMdAdd />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Descripción (opcional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-inner"
                    placeholder="Ej: Compra de productos"
                  />
                </div>

                {/* Error/Success messages */}
                {error && (
                  <div className="p-2 sm:p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs sm:text-sm rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-2 sm:p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs sm:text-sm rounded">
                    {success}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
              >
                Cancelar
              </button>

              {scannedUserId && (
                <button
                  onClick={handleAddPoints}
                  disabled={loading}
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-primary to-black text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base flex items-center justify-center"
                >
                  {loading ? (
                    "Procesando..."
                  ) : (
                    <>
                      <span>Añadir {points} Puntos</span>
                      <IoMdArrowForward className="ml-1 sm:ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}