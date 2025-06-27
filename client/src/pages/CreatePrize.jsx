import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { FaCloudUploadAlt, FaGift } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";

export default function CreatePrize() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    description: "",
    pointsRequired: 100,
    stock: 10,
    isActive: true,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setUploading(true);
      setImageUploadError(false);
      const file = files[0];

      try {
        const url = await storeImage(file);
        setFormData({ ...formData, image: url });
        setImageUploadError(false);
      } catch (error) {
        setImageUploadError("La subida de imagen falló (máximo 2 MB)");
      } finally {
        setUploading(false);
      }
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Subida: ${progress}% completado`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.image)
        return setError("Debes subir una imagen para el premio");
      if (formData.pointsRequired <= 0)
        return setError("Los puntos requeridos deben ser mayores a 0");
        
      setLoading(true);
      setError(false);
      
      // Obtener el ID del negocio del usuario
      const shopRes = await fetch(`/api/user/shops/${currentUser._id}`);
      const shopData = await shopRes.json();
      console.log(shopData);
      
      if (shopData===null) {
        throw new Error('No tienes un negocio registrado y no puedes crear premios');
      }

      const shopId = shopData._id;

      const res = await fetch(`/api/prizes/shop/${shopId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          shop: shopId,
          pointsRequired: Number(formData.pointsRequired),
          stock: Number(formData.stock),
        }),
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (data.success === false) {
        setError(data.message);
        return;
      }
      
      navigate(`/business/${shopId}/prizes`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <div className="flex justify-center items-center gap-2 text-3xl">
        <h1 className=" font-semibold text-center pb-6">Crear Premio</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre del Premio *
            </label>
            <input
              type="text"
              placeholder="Ej: Descuento del 20%"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90"
              id="name"
              required
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descripción *
            </label>
            <textarea
              placeholder="Describe los beneficios del premio"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90"
              id="description"
              rows="3"
              required
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="pointsRequired" className="text-sm font-medium text-gray-700">
                Puntos Requeridos *
              </label>
              <input
                type="number"
                min="1"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90"
                id="pointsRequired"
                required
                onChange={handleChange}
                value={formData.pointsRequired}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="stock" className="text-sm font-medium text-gray-700">
                Cantidad Disponible (0 = ilimitado)
              </label>
              <input
                type="number"
                min="0"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90"
                id="stock"
                onChange={handleChange}
                value={formData.stock}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              onChange={handleChange}
              checked={formData.isActive}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Premio activo (visible para clientes)
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Imagen del Premio
            </label>
            <div className="flex gap-4">
              <label
                className="flex justify-center items-center flex-col h-[200px] cursor-pointer border border-dashed hover:border-primary/90 w-full text-[#d0d2d6] rounded-lg"
                htmlFor="images"
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Imagen del premio"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <span className="text-4xl">
                      <FaCloudUploadAlt />
                    </span>
                    <span>Seleccionar imagen del premio</span>
                  </>
                )}
              </label>
              <input
                onChange={handleImageChange}
                className="hidden"
                type="file"
                id="images"
                accept="image/*"
              />
            </div>
          </div>

          <p className="text-red-500 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.image && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, image: "" })}
              className="p-3 text-white bg-red-700 rounded-lg uppercase hover:opacity-75"
            >
              Eliminar Imagen
            </button>
          )}

          <button
            disabled={loading || uploading}
            className="p-3 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white rounded-lg uppercase disabled:opacity-80 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creando...
              </>
            ) : (
              <>
                <FaGift />
                Crear Premio
              </>
            )}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}