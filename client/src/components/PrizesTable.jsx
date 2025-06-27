import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "./DataTable";
import UpdatePrizeForm from "./UpdatePrizeForm";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaCoins, FaGift } from "react-icons/fa";
import Loading from "./Loadings";

const PrizesTable = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [prizes, setPrizes] = useState([]);
  const [editingPrize, setEditingPrize] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopId, setShopId] = useState(null);

  useEffect(() => {
    const fetchShopAndPrizes = async () => {
      try {
        console.log(`Fetching prizes for user: ${currentUser._id}`);

        const shopRes = await fetch(`/api/user/shops/${currentUser._id}`);
        console.log(`Shop response: ${shopRes.length}`);

        const shopData = await shopRes.json();
        console.log(`Shop data: ${JSON.stringify(shopData)}`);

        
        if (shopData === null) {
          throw new Error("Primero crea tu negocio");
        }

        setShopId(shopId);
        const prizesRes = await fetch(`/api/prizes/shop/${shopData._id}`);
        const prizesData = await prizesRes.json();

        console.log(prizesRes);

        console.log(`Prizes response: ${prizesRes.ok}`);

        if (prizesRes.ok === false) {
          throw new Error(prizesData.message || "Error al cargar premios");
        }

        setPrizes(prizesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndPrizes();
  }, [currentUser._id]);

  const columns = [
    {
      key: "image",
      title: "Imagen",
      render: (prize) => (
        <div className="shrink-0">
          {prize.image ? (
            <img
              src={prize.image}
              alt="premio"
              className="h-16 w-16 object-cover rounded-md"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
              <FaGift className="text-gray-400 text-xl" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      title: "Nombre",
    },
    {
      key: "pointsRequired",
      title: "Puntos Requeridos",
      render: (prize) => (
        <span className="flex items-center">
          <span className="mr-1">{prize.pointsRequired}</span>
          <FaCoins className="text-yellow-600" />
        </span>
      ),
    },
    {
      key: "stock",
      title: "Disponibilidad",
      render: (prize) => (
        <span
          className={prize.stock === 0 ? "text-gray-500" : "text-green-600"}
        >
          {prize.stock === 0 ? "Ilimitado" : prize.stock}
        </span>
      ),
    },
    {
      key: "isActive",
      title: "Estado",
      render: (prize) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            prize.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {prize.isActive ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  const handleEdit = (prize) => {
    setEditingPrize(prize);
    setShowForm(true);
  };

  const handlePrizeDelete = async (prize) => {
    if (!window.confirm("¿Estás seguro de eliminar este premio?")) return;

    try {
      const res = await fetch(`/api/prizes/${prize._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok === false) {
        throw new Error(data.message || "Error al eliminar premio");
      }

      setPrizes((prev) => prev.filter((p) => p._id !== prize._id));
    } catch (error) {
      setError(error.message);
    }
  };

  const togglePrizeStatus = async (prize) => {
    try {
      const res = await fetch(`/api/prizes/${prize._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !prize.isActive }),
      });
      const data = await res.json();

      if (res.ok === false) {
        throw new Error(data.message || "Error al actualizar estado");
      }

      setPrizes((prev) =>
        prev.map((p) =>
          p._id === prize._id ? { ...p, isActive: !prize.isActive } : p
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateSuccess = (updatedPrize) => {
    setPrizes((prev) =>
      prev.map((prize) =>
        prize._id === updatedPrize._id ? updatedPrize : prize
      )
    );
    setShowForm(false);
    setEditingPrize(null);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingPrize(null);
  };

  if (loading) {
    return <Loading></Loading>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
        {showForm ? "Editar Premio" : "Premios de tu Negocio"}
      </h2>

      {showForm ? (
        <div>
          <button
            onClick={handleCancelEdit}
            className="mb-4 flex items-center text-primary hover:text-primary/70 font-medium"
          >
            <FaArrowLeft size={16} className="mr-2 " />
            Volver a la lista
          </button>
          <UpdatePrizeForm
            prize={editingPrize}
            shopId={shopId}
            onSuccess={handleUpdateSuccess}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <>
          {prizes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No has creado premios para tu negocio
              </p>
              <Link
                to="/create-prize"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <FaGift className="inline mr-2" />
                Crear primer premio
              </Link>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={prizes}
              onEdit={handleEdit}
              onDelete={handlePrizeDelete}
              customActions={[
                {
                  label: (prize) => (prize.isActive ? "Desactivar" : "Activar"),
                  action: togglePrizeStatus,
                  className: (prize) =>
                    prize.isActive
                      ? "text-yellow-600 hover:text-yellow-800"
                      : "text-green-600 hover:text-green-800",
                },
              ]}
              pagination={true}
              itemsPerPage={5}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PrizesTable;
