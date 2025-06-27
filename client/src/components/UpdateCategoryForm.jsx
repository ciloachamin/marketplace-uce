import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { app } from "../firebase";
import { fetchCategories } from "../redux/reducers/categorySlice";

export default function CategoryForm({ category, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    slug: "",
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        image: category.image || "",
        slug: category.slug || "",
      });
    } else {
      setFormData({
        name: "",
        image: "",
        slug: "",
      });
    }
  }, [category]);

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setUploading(true);
      setImageUploadError(false);
      try {
        const url = await storeImage(file);
        setFormData({
          ...formData,
          image: url,
        });
        setImageUploadError(false);
      } catch (error) {
        setImageUploadError("La carga de imagen falló (2 mb máximo)");
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("Debes seleccionar una imagen");
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
          console.log(`Upload is ${progress}% done`);
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
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [id]: value,
      };
      if (id === "name" ) {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^\w\s]/gi, "") 
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.image) {
        return setError("Debes subir una imagen");
      }
      if (!formData.name || !formData.slug) {
        return setError("Nombre y slug son requeridos");
      }

      setLoading(true);
      setError(false);

      const endpoint = category
        ? `/api/category/update/${category._id}`
        : "/api/category/create";

      const res = await fetch(endpoint, {
        method: category ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);
      dispatch(fetchCategories())

      if (data.success === false) {
        setError(data.message);
      } else {
        onSuccess(data, !category);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-4 flex-1">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre de la categoría *
          </label>
          <input
            type="text"
            placeholder="Ej: Electrónica"
            className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
            id="name"
            required
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="slug" className="text-sm font-medium text-gray-700">
            Slug (URL amigable) *
          </label>
          <input
            type="text"
            placeholder="Ej: electronica"
            className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
            id="slug"
            required
            onChange={handleChange}
            value={formData.slug}
          />
          <p className="text-xs text-gray-500 mt-1">
            El slug se usa en URLs. Debe ser único y contener solo letras,
            números y guiones.
          </p>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-4">
        <div className="space-y-1">
          <label htmlFor="image" className="text-sm font-medium text-gray-700">
            Imagen de la categoría *
          </label>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFile(e.target.files[0])}
              className="p-3 border border-gray-300 rounded w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
              type="file"
              id="image"
              accept="image/*"
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

        {formData.image && (
          <div className="flex justify-between p-3 border items-center">
            <img
              src={formData.image}
              alt="preview"
              className="object-contain rounded-lg"
            />
          </div>
        )}

        <div className="flex justify-between mt-4 w-full">
          {" "}
          {/* w-full para el contenedor padre */}
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-2"
          >
            Cancelar
          </button>
          <button
            disabled={loading || uploading}
            className="w-1/2 px-4 py-2 bg-gradient-to-r from-primary to-black text-white rounded-lg hover:bg-gradient-to-r hover:to-primary hover:from-black disabled:opacity-80"
            type="submit"
          >
            {loading
              ? category
                ? "Actualizando..."
                : "Creando..."
              : category
              ? "Actualizar Categoría"
              : "Crear Categoría"}
          </button>
        </div>
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </div>
    </form>
  );
}
