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
import { productSchema } from "../lib/validators/product-create";
import { createInputClassNameGetter } from "../utils/formUtils";
export default function CreateProduct() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    category: "",
    price: "",
    stock: 1,
    discount: "",
    campus: "",
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cateShow, setCateShow] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);

  const { errors, validateForm, validateField } = useValidation(productSchema);
  const getInputClassName = createInputClassNameGetter(errors);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch("/api/category/get", {
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);

        if (data.success === false) {
          console.error(data.message);
          return;
        }
        setAllCategory(data);
        setOriginalCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      const filtered = originalCategories.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setAllCategory(filtered);
    } else {
      setAllCategory(originalCategories);
    }
  };

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      console.log("Promises created:", promises.length);
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
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
      console.log(formData);
    } else {
      setImageUploadError("You can only upload 6 images per product");
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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "checkbox" ||
      e.target.type === "select-one" ||
      e.target.type === "radio"
    ) {
      const { id, value, type, checked } = e.target;
      let newValue = value;

      // Transformación de valores según el tipo
      if (type === "checkbox") {
        newValue = checked;
      } else if (type === "number") {
        newValue = value === "" ? undefined : Number(value); // Cambiado a undefined para campos vacíos
      } else if (type === "text" || type === "textarea") {
        // Para campos de texto opcionales (como brand), convertimos "" a undefined
        newValue = value === "" ? undefined : value;
      }
      // select-one y radio mantienen su valor directamente

      // Actualizamos el estado
      setFormData({
        ...formData,
        [id]: newValue,
      });

      // Validamos el campo con el nuevo valor
      validateField(id, newValue);

      console.log("Estado actualizado:", { ...formData, [id]: newValue });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);

      if (formData.imageUrls.length < 1)
        return setError("Debes subir al menos una imagen");
      if (+formData.price < +formData.discount)
        return setError("El descuento debe ser menor que el precio");

      console.log(formData);
      if (!validateForm(formData)) return;

      console.log(formData);
      setLoading(true);
      setError(false);
      const res = await fetch("/api/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      console.log(data);

      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/product/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center pb-6">
        Crear Producto
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Nombre"
              className={getInputClassName("name")}
              id="name"
              maxLength="62"
              minLength="3"
              required
              onChange={handleChange}
              value={formData.name}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
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
              type="text"
              placeholder="Descripción"
              className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
              id="description"
              required
              maxLength="500"
              minLength="10"
              onChange={handleChange}
              value={formData.description}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="space-y-1 relative">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Categoría
            </label>
            <input
              readOnly
              onClick={() => setCateShow(!cateShow)}
              className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90 cursor-pointer"
              value={
                loadingCategories
                  ? "Cargando categorías..."
                  : formData.category
                  ? allCategory.find((c) => c.slug === formData.category)
                      ?.name || "-- Selecciona categoría --"
                  : "-- Selecciona categoría --"
              }
              type="text"
              placeholder={
                loadingCategories
                  ? "Cargando categorías..."
                  : "-- Selecciona categoría --"
              }
              id="category"
              required
            />
            {cateShow && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                <div className="p-2 sticky top-0 bg-white z-10 border-b">
                  <input
                    value={searchValue}
                    onChange={categorySearch}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/90"
                    type="text"
                    placeholder="Buscar categoría..."
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {loadingCategories ? (
                    <div className="p-4 text-center text-gray-500">
                      Cargando categorías...
                    </div>
                  ) : allCategory.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No se encontraron categorías
                    </div>
                  ) : (
                    allCategory.map((c) => (
                      <div
                        key={c._id}
                        className={`p-3 hover:bg-gray-100 cursor-pointer ${
                          formData.category === c.slug && "bg-primary/10"
                        }`}
                        onClick={() => {
                          setCateShow(false);
                          setFormData({ ...formData, category: c.slug }); // Guardar el slug en lugar del name
                          setSearchValue("");
                          setAllCategory(originalCategories);
                        }}
                      >
                        {c.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="brand"
              className="text-sm font-medium text-gray-700"
            >
              Marca
            </label>
            <input
              type="text"
              placeholder="Marca"
              className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
              id="brand"
              onChange={handleChange}
              value={formData.brand}
            />
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="price"
              className="text-sm font-medium text-gray-700"
            >
              Precio
            </label>
            <input
              type="number"
              placeholder="Precio"
              className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
              id="price"
              onChange={handleChange}
              value={formData.price}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="stock"
              className="text-sm font-medium text-gray-700"
            >
              Stock
            </label>
            <input
              type="number"
              placeholder="Stock"
              className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
              id="stock"
              min="1"
              required
              onChange={handleChange}
              value={formData.stock}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="discount"
              className="text-sm font-medium text-gray-700"
            >
              Descuento
            </label>
            <input
              type="number"
              placeholder="Discount"
              className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
              id="discount"
              min="0"
              onChange={handleChange}
              value={formData.discount}
            />
            {errors.discount && (
              <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="campus"
              className="text-sm font-medium text-gray-700"
            >
              Campus
            </label>
            <select
              id="campus"
              className={getInputClassName("campus")}
              required
              onChange={handleChange}
              value={formData.campus}
            >
              <option value="">Seleccione un campus</option>
              <option value="matriz">Matriz</option>
              <option value="iasa-1">IASA 1</option>
              <option value="santo-domingo">Santo Domingo</option>
              <option value="latacunga">Latacunga</option>
            </select>
            {errors.campus && (
              <p className="text-red-500 text-xs mt-1">{errors.campus}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="images"
              className="text-sm font-medium text-gray-700"
            >
              Imágenes:
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
                  alt="product image"
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
            className="p-3 bg-gradient-to-r from-primary to-black text-white rounded-lg uppercase hover:bg-gradient-to-r hover:to-primary hover:from-black disabled:opacity-80"
          >
            {loading ? "Creando..." : "Crear producto"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
