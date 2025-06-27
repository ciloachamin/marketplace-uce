import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddOwnerModal from "../components/AddOwnerModal";
import OwnersList from "../components/OwnersList";
import Loading from "../components/Loadings";
export default function ShopOwnersManagement() {
  const { currentUser } = useSelector((state) => state.user);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        console.log(currentUser);
        
        const response = await fetch(`/api/shop/get/${currentUser.shop}`);
        const data = await response.json();
        console.log(data);
        
        setShop(data);
      } catch (error) {
        console.error("Error fetching shop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [currentUser.shop]);

  const handleAddOwner = async (userId) => {
    try {
      const response = await fetch(
        `/api/shop/${currentUser.shop}/add-owner/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Error al agregar dueño");

      const updatedShop = await fetch(`/api/shop/get/${currentUser.shop}`);
      const data = await updatedShop.json();
      setShop(data);
      setShowAddModal(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleRemoveOwner = async (userId) => {
    try {
      const response = await fetch(
        `/api/shop/${currentUser.shop}/remove-owner/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Error al remover dueño");

      const updatedShop = await fetch(`/api/shop/get/${currentUser.shop}`);
      const data = await updatedShop.json();
      setShop(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Dueños de {shop?.name}
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-default bg-gradient-to-r from-primary to-black p-4 hover:bg-gradient-to-r hover:to-primary hover:from-black text-white px-4 py-2 rounded-md transition"
          >
            Agregar Dueño
          </button>
        </div>

        <OwnersList
          owners={shop?.owners || []}
          currentUserId={shop?.currentUserId}
          onRemove={handleRemoveOwner}
        />
      </div>

      {showAddModal && (
        <AddOwnerModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddOwner}
          currentOwners={shop?.owners || []}
        />
      )}
    </div>
  );
}
