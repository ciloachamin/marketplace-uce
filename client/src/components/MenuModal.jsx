import React, { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import { FiX, FiPlus, FiTrash2, FiChevronDown, FiUpload } from "react-icons/fi";
import { toLocalDateTimeInputValue } from "../utils/formUtils";
import { app } from "../firebase";

const MenuModal = ({ onClose, onCreate, onUpdate, menuType, menu }) => {
  const isEditMode = !!menu;
  const initialFormData = {
    name: "",
    description: "Almuerzo",
    ...(menuType === "daily" && {
      date: new Date(),
      expiresAt: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        23,
        0,
        0
      ),
      price: "",
      items: [
        {
          name: "",
          description: "",
          price: "",
          secondPrice: "",
          category: "plato_principal",
        },
      ],
    }),
    ...(menuType === "fixed" && {
      imageUrl: "",
      isImageMenu: false,
      categories: [
        {
          name: "Platos Principales",
          items: [
            {
              name: "",
              description: "",
              price: "",
              secondPrice: "",
              category: "plato_principal",
            },
          ],
        },
      ],
    }),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [newCategory, setNewCategory] = useState("");
  const [menuMode, setMenuMode] = useState("form");
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (isEditMode) {
      // Convertir fechas de string a Date si es necesario
      const processedMenu = { ...menu };

      if (menuType === "daily") {
        processedMenu.date = new Date(menu.date);
        processedMenu.expiresAt = new Date(menu.expiresAt);
      }

      if (menuType === "fixed" && menu.isImageMenu) {
        setMenuMode("image");
      }

      setFormData(processedMenu);
    }
  }, [menu, isEditMode, menuType]);
  const handleChange = (e) => {
    const { id, value } = e.target;
  
    if (id === "date" || id === "expiresAt") {
      // Crea el objeto Date directamente desde el valor del input (ya en hora local)
      const dateValue = new Date(value);
      setFormData({
        ...formData,
        [id]: dateValue, // Almacena el Date sin ajustes
      });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };
  // Función para subir imagen a Firebase Storage
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

  // Manejador de cambio de imagen
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones
    if (!file.type.match("image.*")) {
      toast.error("Por favor, sube solo imágenes (JPEG, PNG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB máximo
      toast.error("La imagen no debe exceder los 2MB");
      return;
    }

    try {
      setUploading(true);
      setImageUploadError(false);

      const url = await storeImage(file);

      setFormData({
        ...formData,
        imageUrl: url,
        isImageMenu: true,
      });

      toast.success("Imagen subida con éxito");
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageUploadError("Error al subir la imagen (2MB máximo)");
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };
  // ================== LÓGICA PARA MENÚ DIARIO ==================
  const handleDailyItemChange = (index, e) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [e.target.id]:
        e.target.id === "price" || e.target.id === "secondPrice"
          ? parseFloat(e.target.value) || 0
          : e.target.value,
    };
    setFormData({ ...formData, items: newItems });
  };

  const addDailyItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          name: "",
          description: "",
          price: "",
          secondPrice: "",
          category: "plato_principal",
        },
      ],
    });
  };

  const removeDailyItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // ================== LÓGICA PARA MENÚ FIJO ==================
  const handleFixedItemChange = (catIndex, itemIndex, e) => {
    const newCategories = [...formData.categories];
    newCategories[catIndex].items[itemIndex] = {
      ...newCategories[catIndex].items[itemIndex],
      [e.target.id]:
        e.target.id === "price" || e.target.id === "secondPrice"
          ? parseFloat(e.target.value) || 0
          : e.target.value,
    };
    setFormData({ ...formData, categories: newCategories });
  };

  const addFixedItem = (catIndex) => {
    const newCategories = [...formData.categories];
    newCategories[catIndex].items.push({
      name: "",
      description: "",
      price: "",
      secondPrice: "",
      category: "plato_principal",
    });
    setFormData({ ...formData, categories: newCategories });
  };

  const removeFixedItem = (catIndex, itemIndex) => {
    const newCategories = [...formData.categories];
    newCategories[catIndex].items.splice(itemIndex, 1);
    setFormData({ ...formData, categories: newCategories });
  };

  const addCategory = () => {
    if (
      newCategory.trim() &&
      !formData.categories.some(
        (c) => c.name.toLowerCase() === newCategory.trim().toLowerCase()
      )
    ) {
      setFormData({
        ...formData,
        categories: [
          ...formData.categories,
          {
            name: newCategory.trim(),
            items: [
              {
                name: "",
                description: "",
                price: "",
                secondPrice: "",
                category: "plato_principal",
              },
            ],
          },
        ],
      });
      setNewCategory("");
    } else {
      toast.error("La categoría ya existe o está vacía");
    }
  };

  const removeCategory = (index) => {
    const newCategories = [...formData.categories];
    newCategories.splice(index, 1);
    setFormData({ ...formData, categories: newCategories });
  };

  // ================== VALIDACIÓN Y ENVÍO ==================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("El nombre del menú es requerido");
      return;
    }

    if (menuType === "fixed" && menuMode === "image" && !formData.imageUrl) {
      toast.error("Debes subir una imagen para el menú");
      return;
    }

    if (isEditMode) {
      onUpdate(formData);
    } else {
      onCreate(menuType, formData);
    }
  };

  // ================== RENDERIZADO ==================
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Crear Menú {menuType === "daily" ? "Diario" : "Fijo"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos básicos */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Menú
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                placeholder="Ej: Menú Ejecutivo"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>

              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, description: "Almuerzo" })
                  }
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Almuerzo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, description: "Desayuno" })
                  }
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Desayuno
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, description: "Cena" })
                  }
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Cena
                </button>
              </div>

              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="2"
                placeholder="O escribe tu propia descripción..."
              />
            </div>

            {/* Selector de modo para menú fijo */}
            {menuType === "fixed" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Menú Fijo
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setMenuMode("form")}
                    className={`px-4 py-2 rounded-lg ${
                      menuMode === "form"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    Formulario
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuMode("image")}
                    className={`px-4 py-2 rounded-lg ${
                      menuMode === "image"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    Imagen
                  </button>
                </div>
              </div>
            )}

            {menuType === "daily" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha del menú
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    value={toLocalDateTimeInputValue(formData.date)}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Fecha de expiración
                  </label>
                  <input
                    type="datetime-local"
                    id="expiresAt"
                    value={toLocalDateTimeInputValue(formData.expiresAt)}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Precio
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sección de menú diario */}
          {menuType === "daily" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items del Menú
              </label>

              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Nombre del Item
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={item.name}
                        onChange={(e) => handleDailyItemChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                        required
                        placeholder="Nombre del platillo"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Categoría del Item
                      </label>
                      <div className="relative">
                        <select
                          id="category"
                          value={item.category}
                          onChange={(e) => handleDailyItemChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none text-sm"
                          required
                        >
                          <option value="entrada">Entrada</option>
                          <option value="sopa">Sopa</option>
                          <option value="plato_principal">
                            Plato Principal
                          </option>
                          <option value="postre">Postre</option>
                          <option value="bebida">Bebida</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-2.5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={item.description}
                      onChange={(e) => handleDailyItemChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                      placeholder="Descripción breve"
                    />
                  </div>

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Precio
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          id="price"
                          value={item.price}
                          onChange={(e) => handleDailyItemChange(index, e)}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                          step="0.01"
                          min="0"
                          required
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Segundo Precio (opcional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          id="secondPrice"
                          value={item.secondPrice}
                          onChange={(e) => handleDailyItemChange(index, e)}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div> */}

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeDailyItem(index)}
                      className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
                    >
                      <FiTrash2 size={14} className="mr-1" />
                      Eliminar Item
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addDailyItem}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm flex items-center justify-center"
              >
                <FiPlus size={16} className="mr-2" />
                Agregar Item al Menú
              </button>
            </div>
          )}

          {/* Sección de menú fijo */}
          {menuType === "fixed" && menuMode === "form" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorías
                </label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Nueva categoría"
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FiPlus size={18} className="mr-1" />
                    Agregar
                  </button>
                </div>

                {formData.categories.length > 0 && (
                  <div className="space-y-2">
                    {formData.categories.map((category, catIdx) => (
                      <div
                        key={catIdx}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="font-medium text-gray-800">
                          {category.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCategory(catIdx)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {formData.categories.map((category, catIdx) => (
                <div
                  key={catIdx}
                  className="border border-gray-200 p-4 rounded-xl bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {category.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeCategory(catIdx)}
                      className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
                    >
                      <FiTrash2 size={14} className="mr-1" />
                      Eliminar
                    </button>
                  </div>

                  <div className="space-y-4">
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Nombre del Item
                            </label>
                            <input
                              type="text"
                              id="name"
                              value={item.name}
                              onChange={(e) =>
                                handleFixedItemChange(catIdx, itemIdx, e)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                              required
                              placeholder="Nombre del platillo"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Categoría del Item
                            </label>
                            <div className="relative">
                              <select
                                id="category"
                                value={item.category}
                                onChange={(e) =>
                                  handleFixedItemChange(catIdx, itemIdx, e)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none text-sm"
                                required
                              >
                                <option value="entrada">Entrada</option>
                                <option value="sopa">Sopa</option>
                                <option value="plato_principal">
                                  Plato Principal
                                </option>
                                <option value="postre">Postre</option>
                                <option value="bebida">Bebida</option>
                              </select>
                              <FiChevronDown className="absolute right-3 top-2.5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Descripción
                          </label>
                          <input
                            type="text"
                            id="description"
                            value={item.description}
                            onChange={(e) =>
                              handleFixedItemChange(catIdx, itemIdx, e)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            placeholder="Descripción breve"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Precio
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-gray-500 text-sm">
                                $
                              </span>
                              <input
                                type="number"
                                id="price"
                                value={item.price}
                                onChange={(e) =>
                                  handleFixedItemChange(catIdx, itemIdx, e)
                                }
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                step="0.01"
                                min="0"
                                required
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Segundo Precio (opcional)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-gray-500 text-sm">
                                $
                              </span>
                              <input
                                type="number"
                                id="secondPrice"
                                value={item.secondPrice}
                                onChange={(e) =>
                                  handleFixedItemChange(catIdx, itemIdx, e)
                                }
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeFixedItem(catIdx, itemIdx)}
                            className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
                          >
                            <FiTrash2 size={14} className="mr-1" />
                            Eliminar Item
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addFixedItem(catIdx)}
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm flex items-center justify-center"
                    >
                      <FiPlus size={16} className="mr-2" />
                      Agregar Item a esta categoría
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sección para subir imagen en menú fijo */}
          {menuType === "fixed" && menuMode === "image" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen del Menú
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.imageUrl ? (
                  <>
                    <img
                      src={formData.imageUrl}
                      alt="Vista previa del menú"
                      className="max-h-64 mx-auto mb-4 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("menuImageUpload").click()
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                      disabled={uploading}
                    >
                      <FiUpload size={18} className="mr-2" />
                      {uploading ? "Subiendo..." : "Cambiar Imagen"}
                    </button>
                  </>
                ) : (
                  <>
                    <FiUpload
                      size={48}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-500 mb-4">
                      Arrastra y suelta tu imagen aquí, o haz clic para
                      seleccionar
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("menuImageUpload").click()
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                      disabled={uploading}
                    >
                      <FiUpload size={18} className="mr-2" />
                      {uploading ? "Subiendo..." : "Seleccionar Imagen"}
                    </button>
                  </>
                )}

                <input
                  id="menuImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {imageUploadError && (
                <p className="text-red-500 text-sm text-center">
                  {imageUploadError}
                </p>
              )}

              <p className="text-xs text-gray-500 text-center">
                Formatos soportados: JPG, PNG. Tamaño máximo: 2MB.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              {isEditMode ? "Actualizar Menú" : "Crear Menú"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuModal;
