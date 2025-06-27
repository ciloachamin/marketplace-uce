import React, { useEffect, useState } from "react";
import Loading from "./Loadings";

export default function OwnersList({
  owners: ownerIds,
  currentUserId,
  onRemove,
}) {
  const [ownersData, setOwnersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnersData = async () => {
      try {
        setLoading(true);
        if (!ownerIds || ownerIds.length === 0) {
          setOwnersData([]);
          return;
        }
        
        const ownersPromises = ownerIds.map(async (ownerId) => {
          const res = await fetch(`/api/user/${ownerId}`);
          if (!res.ok) throw new Error(`Error al obtener usuario ${ownerId}`);
          return await res.json();
        });

        const owners = await Promise.all(ownersPromises);
        setOwnersData(owners);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnersData();
  }, [ownerIds]);

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {ownersData.length === 0 ? (
        <p className="text-gray-500 text-center md:text-left">No hay dueños registrados</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {ownersData.map((owner) => (
            <li
              key={owner._id}
              className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <img
                  src={owner.avatar || "/default-avatar.png"}
                  alt={owner.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {owner.name} {owner.lastname}
                  </p>
                  <p className="text-gray-500 text-sm truncate">{owner.email}</p>
                </div>
              </div>

              {owner._id !== currentUserId && (
                <button
                  onClick={() => onRemove(owner._id)}
                  className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition self-end sm:self-auto mt-2 sm:mt-0"
                  aria-label={`Quitar a ${owner.name}`}
                >
                  Quitar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}