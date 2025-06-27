import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CreateMenuModal from "../components/CreateMenuModal";
import DailyMenuSection from "../components/DailyMenuSection";
import FixedMenuSection from "../components/FixedMenuSection";
import MenuTabs from "../components/MenuTabs";
import Loading from "./Loadings";
import MenuModal from "./MenuModal";

const MenuManagement = () => {
  const { currentUser } = useSelector((state) => state.user);
  const shopId = currentUser.shop;
  const [menuData, setMenuData] = useState({
    dailyMenus: [],
    fixedMenus: [],
    shopId: { owners: [] },
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const fetchMenuData = async () => {
    try {
      const response = await fetch(`/api/menu/${shopId}`);
      console.log(response);
      const data = await response.json();
      console.log('jaja',data);
      
      const safeData = {
        dailyMenus: data.dailyMenus || [],
        fixedMenus: data.fixedMenus || [],
        shopId: {
          owners: data.shopId?.owners || [],
        },
      };
      setMenuData(safeData);
      setLoading(false);
    } catch (error) {
      setMenuData({
        dailyMenus: [],
        fixedMenus: [],
        shopId: { owners: [] },
      });
      console.log(error);

      toast.error(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMenuData();
  }, []);

  const handleCreateMenu = async (menuType, formData) => {
    try {
      console.log(formData);
      console.log(menuType);
      console.log(shopId);

      const endpoint =
        menuType === "daily"
          ? `/api/menu/${shopId}/daily`
          : `/api/menu/${shopId}/fixed`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      console.log(response);

      if (!response.ok) throw new Error("Error al crear menú");

      const data = await response.json();
      console.log(data);

      const safeData = {
        dailyMenus: data.dailyMenus || [],
        fixedMenus: data.fixedMenus || [],
        shopId: {
          owners: data.shopId?.owners || [],
        },
      };

      console.log(safeData);

      console.log('ppppppp',menuData);

      setMenuData(safeData);
      fetchMenuData();
      toast.success(
        `Menú ${menuType === "daily" ? "diario" : "fijo"} creado con éxito`
      );
      setShowCreateModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Menús</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="cursor-default bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white px-4 py-2 rounded-lg"
        >
          {`Crear menú ${activeTab === "daily" ? "diario" : "fijo"} `}
        </button>
      </div>

      <MenuTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "daily" ? (
        <DailyMenuSection
          menus={menuData.dailyMenus}
          shopId={shopId}
          currentUser={currentUser}
          shopOwners={menuData.shopId.owners}
          onMenuUpdated={fetchMenuData}
        />
      ) : (
        <FixedMenuSection
          menus={menuData.fixedMenus}
          shopId={shopId}
          currentUser={currentUser}
          shopOwners={menuData.shopId.owners}
          onMenuUpdated={fetchMenuData}
        />
      )}

      {showCreateModal && (
        <MenuModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateMenu}
          menuType={activeTab}
        />
      )}
    </div>
  );
};

export default MenuManagement;
