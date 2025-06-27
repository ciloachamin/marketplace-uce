import { useState } from 'react';
import { FaGift } from 'react-icons/fa';

const UpdatePrizeForm = ({ prize, shopId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: prize?.name || '',
    description: prize?.description || '',
    pointsRequired: prize?.pointsRequired || 100,
    image: prize?.image || '',
    stock: prize?.stock || 10,
    isActive: prize?.isActive !== undefined ? prize.isActive : true,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const endpoint = prize?._id 
        ? `/api/prizes/update/${prize._id}`
        : '/api/prizes/create';

      const method = prize?._id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          shop: shopId,
          pointsRequired: Number(formData.pointsRequired),
          stock: Number(formData.stock),
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error al guardar premio');
      }

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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre del Premio *
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border rounded-lg"
            required
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="pointsRequired" className="block text-sm font-medium text-gray-700">
            Puntos Requeridos *
          </label>
          <input
            type="number"
            id="pointsRequired"
            min="1"
            className="w-full p-2 border rounded-lg"
            required
            onChange={handleChange}
            value={formData.pointsRequired}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción *
        </label>
        <textarea
          id="description"
          rows="3"
          className="w-full p-2 border rounded-lg"
          required
          onChange={handleChange}
          value={formData.description}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Imagen (URL)
          </label>
          <input
            type="url"
            id="image"
            className="w-full p-2 border rounded-lg"
            onChange={handleChange}
            value={formData.image}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {formData.image && (
            <div className="mt-2">
              <img 
                src={formData.image} 
                alt="Vista previa" 
                className="h-32 object-contain rounded-lg border"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Cantidad Disponible (0 = ilimitado)
          </label>
          <input
            type="number"
            id="stock"
            min="0"
            className="w-full p-2 border rounded-lg"
            onChange={handleChange}
            value={formData.stock}
          />

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={formData.isActive}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Premio activo
            </label>
          </div>
        </div>
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
          className="px-4 py-2 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white rounded-md flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <FaGift className="mr-2" />
              {prize?._id ? 'Actualizar Premio' : 'Crear Premio'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UpdatePrizeForm;