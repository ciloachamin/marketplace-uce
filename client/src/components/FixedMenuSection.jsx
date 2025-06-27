import React, { useState } from "react";
import { toast } from "react-toastify";
import EditMenuModal from "./EditMenuModal";
import MenuModal from "./MenuModal";

const FixedMenuSection = ({
  menus,
  shopId,
  currentUser,
  shopOwners,
  onMenuUpdated,
}) => {
  const [editingMenu, setEditingMenu] = useState(null);
  const handleDeleteMenu = async (menuId) => {
    try {
      const response = await fetch(`/api/menu/${shopId}/fixed/${menuId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al eliminar menú");

      toast.success("Menú eliminado con éxito");
      onMenuUpdated();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleStatus = async (menuId) => {
    try {
      const response = await fetch(
        `/api/menu/${shopId}/fixed/${menuId}/toggle`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Error al actualizar estado");

      toast.success("Estado del menú actualizado");
      onMenuUpdated();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateMenu = async (formData) => {
    try {
      const response = await fetch(
        `/api/menu/${shopId}/fixed/${editingMenu._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar menú");

      toast.success("Menú actualizado con éxito");
      setEditingMenu(null);
      onMenuUpdated();
    } catch (error) {
      toast.error(error.message);
    }
  };

  console.log('lllllllllllll',currentUser);
  console.log(shopOwners);
  
  
  const canEdit =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "shop");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Menús Fijos</h2>

      {menus.length === 0 ? (
        <p className="text-gray-500">No hay menús fijos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map((menu) => (
            <div key={menu._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{menu.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    menu.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {menu.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{menu.description}</p>

              {menu.isImageMenu ? (
                <div className="mb-3">
                  <img
                    src={menu.imageUrl}
                    alt={`Menú ${menu.name}`}
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {menu.description}
                  </p>
                </div>
              ) : (
                <div className="mb-3">
                  {menu.categories?.map((category, catIdx) => (
                    <div key={catIdx} className="mb-4">
                      <h4 className="font-medium mb-2 border-b pb-1">
                        {category.name}
                      </h4>
                      <div className="space-y-2">
                        {category.items?.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex justify-between items-start"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-gray-600">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${item.price.toFixed(2)}
                              </p>
                              {item.secondPrice && (
                                <p className="text-xs text-gray-500">
                                  ${item.secondPrice.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {canEdit && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => setEditingMenu(menu)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleStatus(menu._id)}
                    className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    {menu.isActive ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(menu._id)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* {editingMenu && (
        <EditMenuModal
          menu={editingMenu}
          onClose={() => setEditingMenu(null)}
          onSave={handleUpdateMenu}
          menuType="fixed"
        />
      )} */}

      {editingMenu && (
        <MenuModal
          menu={editingMenu}
          onClose={() => setEditingMenu(null)}
          onUpdate={handleUpdateMenu}
          menuType="fixed"
        />
      )}
    </div>
  );
};

export default FixedMenuSection;
