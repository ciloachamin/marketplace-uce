import React, { useState } from "react";
import { toast } from "react-toastify";
import { formatDateTime } from "../utils/formUtils";
import EditMenuModal from "./EditMenuModal";
import MenuItemCard from "./MenuItemCard";
import MenuModal from "./MenuModal";

const DailyMenuSection = ({
  menus,
  shopId,
  currentUser,
  shopOwners,
  onMenuUpdated,
}) => {
  const [editingMenu, setEditingMenu] = useState(null);

  const handleDeleteMenu = async (menuId) => {
    try {
      const response = await fetch(`/api/menu/${shopId}/daily/${menuId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar menú");
      onMenuUpdated();
      toast.success("Menú eliminado con éxito");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleStatus = async (menuId) => {
    try {
      const response = await fetch(
        `/api/menu/${shopId}/daily/${menuId}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
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
        `/api/menu/${shopId}/daily/${editingMenu._id}`,
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

  console.log(shopOwners);
  
  const canEdit =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "shop");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Menús Diarios</h2>

      {menus.length === 0 ? (
        <p className="text-gray-500">No hay menús diarios disponibles</p>
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

              <div className="mb-3">
                {menu.price && (
                  <p className="font-medium">
                    {" "}
                    Precio: ${menu.price.toFixed(2)}
                  </p>
                )}
                <h4 className="font-medium mb-1">Items:</h4>
                {menu.items.map((item, idx) => (
                  <MenuItemCard key={idx} item={item} />
                ))}
              </div>

              <p className="text-sm text-gray-500">
                <span className="font-medium">Creado:</span>{" "}
                {formatDateTime(menu.date)}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Expira:</span>{" "}
                {formatDateTime(menu.expiresAt)}
              </p>

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
          menuType="daily"
        />
      )} */}
      {editingMenu && (
        <MenuModal
          menu={editingMenu}
          onClose={() => setEditingMenu(null)}
          onUpdate={handleUpdateMenu}

          menuType="daily"
        />
      )}
    </div>
  );
};

export default DailyMenuSection;
