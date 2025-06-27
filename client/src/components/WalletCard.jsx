import { FaCoins, FaGift } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function WalletCard({ wallet }) {
  const { currentUser } = useSelector((state) => state.user);
  
  // Verificaciones seguras en todos los niveles
  const isOwner = Boolean(
    currentUser?._id && 
    wallet?.business?._id && 
    currentUser._id === wallet.business._id
  );

  // Si no existe el wallet o su business, no renderizar nada
  if (!wallet || !wallet.business) {
    return null; // O puedes mostrar un skeleton loading
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Imagen con fallback seguro */}
          {wallet.business?.logo ? (
            <img
              src={wallet.business.logo}
              alt={wallet.business.name || "Logo del negocio"}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-500">
                {wallet.business?.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold">
              {wallet.business?.name || "Negocio no disponible"}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {wallet.business?.category || "Sin categoría"}
            </p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <p className="text-2xl font-bold flex gap-2 items-center justify-center">
            {wallet.availablePoints ?? 0}
            <FaCoins className="text-yellow-600" />
          </p>

          <Link
            to={`/wallet/transactions/${wallet._id}`}
            className="text-primary text-sm hover:underline mt-1"
          >
            Ver historial
          </Link>
        </div>
      </div>

      {!isOwner && (wallet.availablePoints || 0) > 0 && (
        <div className="mt-4 border-t pt-3">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <FaGift className="mr-1" />
            Premios que puedes reclamar
          </h4>
          <Link
            to={`/business/${wallet.business?._id}/prizes`}
            className="text-sm text-primary hover:underline"
          >
            Ver todos los premios disponibles con tus puntos...
          </Link>
        </div>
      )}
    </div>
  );
}

WalletCard.propTypes = {
  wallet: PropTypes.shape({
    _id: PropTypes.string,
    availablePoints: PropTypes.number,
    business: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      category: PropTypes.string,
      logo: PropTypes.string,
    }),
  }),
};

WalletCard.defaultProps = {
  wallet: {
    business: {},
    availablePoints: 0,
  },
};