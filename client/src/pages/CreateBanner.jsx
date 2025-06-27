import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState, useEffect, useRef } from "react";
import { FaCloudUploadAlt, FaSearch, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";

export default function CreateBanner() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrl: "",
    name: "",
    priority: 1,
    shopRef: '',
    shopName: ''
  });
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [shopSearch, setShopSearch] = useState("");
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [loadingShops, setLoadingShops] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowShopDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Obtener lista de negocios
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoadingShops(true);
        const res = await fetch('/api/shop/get');
        const data = await res.json();
        if (Array.isArray(data)) {
          setShops(data);
          setFilteredShops(data);
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
        setError("Error al cargar los negocios");
      } finally {
        setLoadingShops(false);
      }
    };
    fetchShops();
  }, []);

  // Filtrar negocios según búsqueda
  useEffect(() => {
    if (shopSearch === "") {
      setFilteredShops(shops);
    } else {
      const filtered = shops.filter(shop =>
        shop.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
        shop.category.toLowerCase().includes(shopSearch.toLowerCase()) ||
        (shop.address && shop.address.toLowerCase().includes(shopSearch.toLowerCase()))
      );
      setFilteredShops(filtered);
    }
  }, [shopSearch, shops]);

  // Manejar subida de imagen
  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setUploading(true);
      setImageUploadError(false);
      const file = files[0];

      if (file.size > 2 * 1024 * 1024) {
        setImageUploadError("La imagen es muy grande (máximo 2MB)");
        setUploading(false);
        return;
      }

      try {
        const url = await storeImage(file);
        setFormData({ ...formData, imageUrl: url });
      } catch (error) {
        setImageUploadError("Error al subir la imagen");
      } finally {
        setUploading(false);
      }
    }
  };

  // Subir imagen a Firebase
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `banners/${fileName}`);
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

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Seleccionar un negocio
  const handleShopSelect = (shop) => {
    setFormData({
      ...formData,
      shopRef: shop._id,
      shopName: shop.name
    });
    setShopSearch(shop.name);
    setShowShopDropdown(false);
  };

  // Limpiar selección de negocio
  const clearShopSelection = () => {
    setFormData({
      ...formData,
      shopRef: '',
      shopName: ''
    });
    setShopSearch("");
    setShowShopDropdown(false);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.imageUrl) return setError("Debes subir una imagen para el banner");
      if (!formData.shopRef) return setError("Debes seleccionar un negocio");
      
      setLoading(true);
      setError(false);
      
      const res = await fetch("/api/banner/create", {
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
      setLoading(false);
      
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/banner/${data._id}`);
      }
    } catch (error) {
      setError("Error al crear el banner");
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl font-semibold text-center pb-6">
          Crear Banner
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {/* Nombre del Banner */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre del Banner
            </label>
            <input
              type="text"
              placeholder="Nombre del banner"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90"
              id="name"
              required
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          {/* Selector de Negocio */}
          <div className="space-y-1 relative" ref={dropdownRef}>
            <label htmlFor="shopSearch" className="text-sm font-medium text-gray-700">
              Negocio Asociado
            </label>
            <div className="relative">
              <input
                type="text"
                id="shopSearch"
                placeholder="Buscar negocio por nombre, categoría o dirección..."
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90 pr-10"
                value={shopSearch}
                onChange={(e) => {
                  setShopSearch(e.target.value);
                  setShowShopDropdown(true);
                }}
                onFocus={() => setShowShopDropdown(true)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                {formData.shopRef && (
                  <button
                    type="button"
                    onClick={clearShopSelection}
                    className="text-gray-400 hover:text-gray-600 mr-2"
                  >
                    <FaTimes />
                  </button>
                )}
                <FaSearch className="text-gray-400" />
              </div>
            </div>
            
            {showShopDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                <div className="p-2 sticky top-0 bg-white z-10 border-b">
                  <input
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/90"
                    type="text"
                    placeholder="Buscar negocio..."
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {loadingShops ? (
                    <div className="p-4 text-center text-gray-500">
                      Cargando negocios...
                    </div>
                  ) : filteredShops.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No se encontraron negocios
                    </div>
                  ) : (
                    filteredShops.map((shop) => (
                      <div
                        key={shop._id}
                        className={`p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 ${
                          formData.shopRef === shop._id && "bg-primary/10"
                        }`}
                        onClick={() => handleShopSelect(shop)}
                      >
                        <img 
                          src={shop.logo || "https://via.placeholder.com/40"} 
                          alt={shop.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{shop.name}</p>
                          <p className="text-sm text-gray-600 truncate">
                            {shop.category} {shop.address && `• ${shop.address}`}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            <input
              type="hidden"
              id="shopRef"
              value={formData.shopRef}
            />
          </div>

          {/* Prioridad */}
          <div className="space-y-1">
            <label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Prioridad (1 = más alto)
            </label>
            <input
              type="number"
              placeholder="Prioridad"
              className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90"
              id="priority"
              min="1"
              required
              onChange={handleChange}
              value={formData.priority}
            />
          </div>

          {/* Imagen del Banner */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Imagen del Banner
            </label>
            <div className="flex gap-4">
              <label
                className="flex justify-center items-center flex-col h-[300px] cursor-pointer border border-dashed hover:border-primary/90 w-full text-[#d0d2d6] rounded-lg relative"
                htmlFor="images"
              >
                {formData.imageUrl ? (
                  <>
                    <img
                      src={formData.imageUrl}
                      alt="Imagen del banner"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="text-white">Subiendo imagen...</div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-4xl">
                      <FaCloudUploadAlt />
                    </span>
                    <span>Seleccionar imagen de banner</span>
                    <span className="text-sm mt-2">(Tamaño máximo: 2MB)</span>
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
            <p className="text-red-500 text-sm">
              {imageUploadError && imageUploadError}
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-2">
            {formData.imageUrl && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                className="p-3 text-white bg-red-700 rounded-lg uppercase hover:opacity-75"
              >
                Eliminar Imagen
              </button>
            )}

            <button
              disabled={loading || uploading}
              className="p-3 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </>
              ) : (
                "Crear Banner"
              )}
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </form>
    </main>
  );
}