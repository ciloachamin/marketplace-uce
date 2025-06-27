import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditMenuModal = ({ menu, onClose, onSave, menuType }) => {
  const [formData, setFormData] = useState(menu);
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    secondPrice: "",
    category: "plato_principal",
  });

  useEffect(() => {
    setFormData(menu);
  }, [menu]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;

    if (id === "date") {
      const [year, month, day] = value.split("-").map(Number);
      const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      newValue = utcDate.toISOString();
    }

    setFormData({
      ...formData,
      [id]: newValue,
    });
  };

  const handleItemChange = (index, e) => {
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

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
    setNewItem({
      name: "",
      description: "",
      price: "",
      secondPrice: "",
      category: "plato_principal",
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const addCategoryItem = (catIndex, item) => {
    const newCategories = [...formData.categories];
    newCategories[catIndex].items.push(item);
    setFormData({ ...formData, categories: newCategories });
    setNewItem({
      name: "",
      description: "",
      price: "",
      secondPrice: "",
      category: "plato_principal",
    });
  };

  const removeCategoryItem = (catIndex, itemIndex) => {
    const newCategories = [...formData.categories];
    newCategories[catIndex].items = newCategories[catIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    setFormData({ ...formData, categories: newCategories });
  };

  const addCategory = () => {
    if (
      newCategory.trim() &&
      !formData.categories.some((c) => c.name === newCategory.trim())
    ) {
      setFormData({
        ...formData,
        categories: [
          ...formData.categories,
          { name: newCategory.trim(), items: [] },
        ],
      });
      setNewCategory("");
    }
  };

  const removeCategory = (index) => {
    const newCategories = formData.categories.filter((_, i) => i !== index);
    setFormData({ ...formData, categories: newCategories });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("El nombre del menú es requerido");
      return;
    }

    if (
      menuType === "daily" &&
      formData.items.some((item) => !item.name.trim())
    ) {
      toast.error("Todos los items deben tener nombre y precio");
      return;
    }

    if (
      menuType === "fixed" &&
      formData.categories.some((cat) => cat.items.length === 0)
    ) {
      toast.error("Las categorías no pueden estar vacías");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Editar Menú {menuType === "daily" ? "Diario" : "Fijo"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Nombre del Menú
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>

          {menuType === "daily" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                id="date"
                value={
                  formData.date
                    ? new Date(formData.date).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <div>
                <label className="block text-xs font-medium mb-1">Precio</label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          )}

          {menuType === "fixed" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Categorías
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 p-2 border rounded-l"
                  placeholder="Nueva categoría"
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white px-3 rounded-r"
                >
                  Agregar
                </button>
              </div>

              {formData.categories.length > 0 && (
                <div className="space-y-4 mb-4">
                  {formData.categories.map((category, catIdx) => (
                    <div key={catIdx} className="border p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{category.name}</h3>
                        <button
                          type="button"
                          onClick={() => removeCategory(catIdx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar Categoría
                        </button>
                      </div>

                      <div className="space-y-3">
                        {category.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="border-l-2 pl-3 py-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{item.name}</span>
                              <div>
                                <span className="mr-2">${item.price}</span>
                                {item.secondPrice && (
                                  <span> / ${item.secondPrice}</span>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeCategoryItem(catIdx, itemIdx)
                                  }
                                  className="ml-2 text-red-500 hover:text-red-700 text-sm"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <h4 className="text-sm font-medium mb-2">
                          Agregar Item a esta categoría
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Nombre
                            </label>
                            <input
                              type="text"
                              value={newItem.name}
                              onChange={(e) =>
                                setNewItem({ ...newItem, name: e.target.value })
                              }
                              className="w-full p-2 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Categoría
                            </label>
                            <select
                              value={newItem.category}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  category: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded"
                            >
                              <option value="entrada">Entrada</option>
                              <option value="sopa">Sopa</option>
                              <option value="plato_principal">
                                Plato Principal
                              </option>
                              <option value="postre">Postre</option>
                              <option value="bebida">Bebida</option>
                              <option value="otros">Otros</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-2">
                          <label className="block text-xs font-medium mb-1">
                            Descripción
                          </label>
                          <input
                            type="text"
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                description: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Precio
                            </label>
                            <input
                              type="number"
                              value={newItem.price}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  price: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded"
                              step="0.01"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Segundo Precio (opcional)
                            </label>
                            <input
                              type="number"
                              value={newItem.secondPrice}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  secondPrice: e.target.value,
                                })
                              }
                              className="w-full p-2 border rounded"
                              step="0.01"
                              min="0"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            addCategoryItem(catIdx, newItem);
                            setNewItem({
                              name: "",
                              description: "",
                              price: "",
                              secondPrice: "",
                              category: "plato_principal",
                            });
                          }}
                          className="mt-2 text-sm bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white px-3 py-1 rounded"
                          disabled={!newItem.name || !newItem.price}
                        >
                          Agregar Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {menuType === "daily" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Items del Menú
              </label>
              {formData.items.map((item, index) => (
                <div key={index} className="border p-3 rounded mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Categoría
                      </label>
                      <select
                        id="category"
                        value={item.category}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="entrada">Entrada</option>
                        <option value="sopa">Sopa</option>
                        <option value="plato_principal">Plato Principal</option>
                        <option value="postre">Postre</option>
                        <option value="bebida">Bebida</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Precio</label>
                      <input
                        type="number"
                        id="price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full p-2 border rounded"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Segundo Precio (opcional)</label>
                      <input
                        type="number"
                        id="secondPrice"
                        value={item.secondPrice}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full p-2 border rounded"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div> */}

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Eliminar Item
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                + Agregar Item
              </button>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white rounded"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuModal;
