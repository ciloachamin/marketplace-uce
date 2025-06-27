import { useEffect, useMemo, useState } from "react";

export default function AddOwnerModal({ onClose, onAdd, currentOwners }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/", {
          credentials: 'include', 
        });
        console.log(res);
        

        if (!res.ok) throw new Error("Error al obtener usuarios");
        const data = await res.json();
        setAllUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();

    return allUsers.filter((user) => {
      const isOwner = currentOwners.some((owner) => owner._id === user._id);
      if (isOwner) return false;
      return (
        user.name.toLowerCase().includes(term) ||
        user.lastname.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, allUsers, currentOwners]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Agregar Dueño</h2>
            <button
              onClick={onClose}
              className="cursor-default text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Buscar Usuario
            </label>
            <input
              type="text"
              id="search"
              placeholder="Nombre, apellido o email..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">Cargando usuarios...</div>
            ) : searchTerm.length < 3 ? (
              <p className="text-gray-500 text-center py-4">
                Ingresa al menos 3 caracteres para buscar
              </p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No se encontraron usuarios coincidentes
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li key={user._id} className="py-3 px-2 hover:bg-gray-50">
                    <button
                      onClick={() => onAdd(user._id)}
                      className="w-full flex items-center space-x-3 text-left"
                    >
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">
                          {user.name} {user.lastname}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
