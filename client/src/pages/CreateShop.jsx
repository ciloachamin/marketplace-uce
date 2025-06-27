import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { useValidation } from "../hooks/useValidation";
import { shopSchema } from "../lib/validators/shop-schema";
import { createInputClassNameGetter } from "../utils/formUtils";
import { useDispatch } from "react-redux";
import { fetchUser } from "../redux/user/userSlice";

export default function ShopManagement() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingShop, setExistingShop] = useState(null);
  const [fetchingShop, setFetchingShop] = useState(true);

  const [files, setFiles] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [menuImageFile, setMenuImageFile] = useState(null);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    phone: "",
    socialMedia: "",
    openingHours: "09:00",
    closingHours: "18:00",
    category: "",
    logo: "",
    imageDailyMenu: "",
  });

  const { errors, validateForm, validateField } = useValidation(shopSchema);
  const getInputClassName = createInputClassNameGetter(errors);

  useEffect(() => {
    const fetchUserShop = async () => {
      try {
        const res = await fetch(`/api/user/shops/${currentUser._id}`);
        if (!res.ok) {
          throw new Error("No se pudo obtener la tienda");
        }
        const data = await res.json();
        console.log(data);

        const shopData = Array.isArray(data) ? data[0] : data;

        if (shopData) {
          setExistingShop(shopData);
          setFormData({
            imageUrls: shopData.imageUrls || [],
            name: shopData.name || "",
            description: shopData.description || "",
            category: shopData.category || "",
            address: shopData.address || "",
            phone: shopData.phone || "",
            socialMedia: Array.isArray(shopData.socialMedia)
              ? shopData.socialMedia.join(", ")
              : shopData.socialMedia || "",
            openingHours: shopData.openingHours || "09:00",
            closingHours: shopData.closingHours || "18:00",
            logo: shopData.logo || "",
            imageDailyMenu: shopData.imageDailyMenu || "",
          });
        }
      } catch (error) {
        console.error("Error al cargar la tienda:", error);
        setError("Error al cargar los datos de la tienda");
      } finally {
        setFetchingShop(false);
      }
    };

    if (currentUser?._id) {
      fetchUserShop();
    }
  }, [currentUser?._id]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(
            "La subida de imágenes falló (máximo 2 MB por imagen)"
          );
          setUploading(false);
        });
    } else {
      setImageUploadError("Solo puedes subir hasta 6 imágenes por tienda");
      setUploading(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    try {
      setUploading(true);
      const url = await storeImage(logoFile);
      setFormData({ ...formData, logo: url });
      setUploading(false);
    } catch (error) {
      setImageUploadError("Error al subir el logo");
      setUploading(false);
    }
  };

  const handleMenuImageUpload = async () => {
    if (!menuImageFile) return;

    try {
      setUploading(true);
      const url = await storeImage(menuImageFile);
      setFormData({ ...formData, imageDailyMenu: url });
      setUploading(false);
    } catch (error) {
      setImageUploadError("Error al subir la imagen del menú");
      setUploading(false);
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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [id]: newValue,
    });

    validateField(id, newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm(formData)) return;
      if (formData.imageUrls.length < 1) {
        return setError("Debes subir al menos una imagen");
      }
      setLoading(true);
      setError(false);

      const socialMediaArray = formData.socialMedia
        ? formData.socialMedia
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url !== "")
        : [];

      const endpoint = existingShop
        ? `/api/shop/update/${existingShop._id}`
        : "/api/shop/create";

      const res = await fetch(endpoint, {
        method: existingShop ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          socialMedia: socialMediaArray,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al guardar");
      }
      console.log(data);

      console.log(existingShop);

      // Actualizar el estado de Redux con la tienda actualizad
      await dispatch(fetchUser(currentUser._id)).unwrap(); // ¡Aquí se usa!
      navigate(`/shop/${data._id || existingShop._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingShop) {
    return (
      <div className="text-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Cargando datos de tu negocio...</p>
      </div>
    );
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center pb-6">
        {existingShop ? "Actualizar Mi Negocio" : "Crear Mi Negocio"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre de la tienda
            </label>
            <input
              type="text"
              placeholder="Nombre de la tienda"
              className={getInputClassName("name")}
              id="name"
              required
              onChange={handleChange}
              value={formData.name}
              maxLength={20}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Categoría
            </label>
            <select
              id="category"
              className={getInputClassName("category")}
              required
              onChange={handleChange}
              value={formData.category}
            >
              <option value="">Seleccione una categoría</option>
              <option value="restaurant">Restaurante</option>
              <option value="retail">Tienda</option>
              <option value="service">Servicio</option>
              <option value="other">Otro</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Dirección
            </label>
            <input
              type="text"
              placeholder="Dirección"
              className={getInputClassName("address")}
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
              maxLength={100}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              placeholder="Descripción"
              className={getInputClassName("description")}
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
              maxLength={500}
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <input
              type="tel"
              placeholder="Teléfono"
              className={getInputClassName("phone")}
              id="phone"
              required
              onChange={handleChange}
              value={formData.phone}
              maxLength={10}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="socialMedia"
              className="text-sm font-medium text-gray-700"
            >
              Redes sociales (separadas por comas)
            </label>
            <input
              type="text"
              placeholder="Redes sociales (separadas por comas)"
              className={getInputClassName("socialMedia")}
              id="socialMedia"
              onChange={handleChange}
              value={formData.socialMedia}
            />
            {errors.socialMedia && (
              <p className="text-red-500 text-xs mt-1">{errors.socialMedia}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="space-y-1 flex-1">
              <label
                htmlFor="openingHours"
                className="text-sm font-medium text-gray-700"
              >
                Horario de apertura
              </label>
              <input
                type="time"
                className={getInputClassName("openingHours")}
                id="openingHours"
                required
                onChange={handleChange}
                value={formData.openingHours}
              />
              {errors.openingHours && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.openingHours}
                </p>
              )}
            </div>

            <div className="space-y-1 flex-1">
              <label
                htmlFor="closingHours"
                className="text-sm font-medium text-gray-700"
              >
                Horario de cierre
              </label>
              <input
                type="time"
                className={getInputClassName("closingHours")}
                id="closingHours"
                required
                onChange={handleChange}
                value={formData.closingHours}
              />
              {errors.closingHours && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.closingHours}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          {/* Campo para subir el logo */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Logo del negocio
            </label>
            <div className="flex gap-4">
              <input
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="p-3 border border-gray-300 rounded w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
                type="file"
                accept="image/*"
              />
              <button
                type="button"
                disabled={uploading || !logoFile}
                onClick={handleLogoUpload}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Subiendo..." : "Subir Logo"}
              </button>
            </div>
            {formData.logo && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={formData.logo}
                  alt="Logo del negocio"
                  className="w-16 h-16 object-cover rounded-full border"
                />
                <span className="text-sm text-gray-600">Logo actual</span>
              </div>
            )}
          </div>

          {/* Campo para subir la imagen del menú diario */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Imagen de fondo para menú del día
            </label>
            <div className="flex gap-4">
              <input
                onChange={(e) => setMenuImageFile(e.target.files[0])}
                className="p-3 border border-gray-300 rounded w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
                type="file"
                accept="image/*"
              />
              <button
                type="button"
                disabled={uploading || !menuImageFile}
                onClick={handleMenuImageUpload}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Subiendo..." : "Subir Imagen"}
              </button>
            </div>
            {formData.imageDailyMenu && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={formData.imageDailyMenu}
                  alt="Imagen de menú diario"
                  className="w-16 h-16 object-cover rounded border"
                />
                <span className="text-sm text-gray-600">Imagen actual</span>
              </div>
            )}
          </div>

          {/* Campo para subir imágenes generales */}
          <div className="space-y-1">
            <label
              htmlFor="images"
              className="text-sm font-medium text-gray-700"
            >
              Imágenes del negocio:
              <span className="font-normal text-gray-600 ml-2">
                La primera imagen será la portada (máximo 6)
              </span>
            </label>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Subiendo..." : "Subir"}
              </button>
            </div>
          </div>

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="Imagen de la tienda"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Eliminar
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-gradient-to-r from-primary to-black text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
          >
            {loading
              ? "Guardando..."
              : existingShop
              ? "Actualizar negocio"
              : "Crear negocio"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
