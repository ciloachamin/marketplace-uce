import { useState } from "react";
import { FaUser, FaUserShield } from "react-icons/fa";

const UpdateUserForm = ({ user, currentUser, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    name: user?.name || "",
    lastname: user?.lastname || "",
    role: user?.role || "user",
    avatar: user?.avatar || "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/user/update/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      onSuccess(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de usuario *
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-2 border rounded-lg"
            required
            onChange={handleChange}
            value={formData.username}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border rounded-lg"
            required
            onChange={handleChange}
            value={formData.email}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border rounded-lg"
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lastname"
            className="block text-sm font-medium text-gray-700"
          >
            Apellido
          </label>
          <input
            type="text"
            id="lastname"
            className="w-full p-2 border rounded-lg"
            onChange={handleChange}
            value={formData.lastname}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Rol *
        </label>
        <div className="flex items-center gap-4">
          <select
            id="role"
            className="w-full p-2 border rounded-lg"
            required
            onChange={handleChange}
            value={formData.role}
          >
            <option value="user">Usuario Normal</option>
            <option value="admin">Administrador</option>
            <option value="shop">Dueño de Negocio</option>
            <option value="seller">Vendedor</option>
          </select>
          {formData.role === "admin" ? (
            <FaUserShield className=" text-xl" />
          ) : (
            <FaUser className="text-gray-600 text-xl" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="avatar"
          className="block text-sm font-medium text-gray-700"
        >
          URL del Avatar
        </label>
        <input
          type="url"
          id="avatar"
          placeholder="https://ejemplo.com/avatar.jpg"
          className="w-full p-2 border rounded-lg"
          onChange={handleChange}
          value={formData.avatar}
        />
        {formData.avatar && (
          <img
            src={formData.avatar}
            alt="Avatar preview"
            className="h-20 w-20 rounded-full object-cover mt-2"
          />
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white rounded-md flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </button>
      </div>
    </form>
  );
};

export default UpdateUserForm;
