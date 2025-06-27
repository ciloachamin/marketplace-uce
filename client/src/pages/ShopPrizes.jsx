import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaGift, FaCoins } from "react-icons/fa";

const ShopPrizes = () => {
  const { shopId } = useParams();
  const [prizes, setPrizes] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const res = await fetch(`/api/prizes/claimable/${shopId}`);
        const data = await res.json();
        setPrizes(data.prizes || []);
        setUserPoints(data.userPoints || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, [shopId]);

  if (loading) return <div>Cargando premios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <FaGift className="text-2xl" />
        <h2 className="text-2xl font-bold">Premios del Negocio</h2>
        <div className="ml-auto flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
          <FaCoins className="text-yellow-600" />
          <span className="font-semibold">Tus puntos: {userPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Este negocio no tiene premios disponibles.
          </div>
        ) : (
          prizes.map((prize) => (
            <div
              key={prize._id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src={prize.image || "https://via.placeholder.com/300"}
                  alt={prize.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{prize.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                    <FaCoins className="text-yellow-600" />
                    <span className="font-semibold">
                      {prize.pointsRequired}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{prize.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Stock: {prize.stock === 0 ? "Ilimitado" : prize.stock}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopPrizes;
