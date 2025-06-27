import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DataTable from "./DataTable";
import UpdateBannerForm from "./UpdateBannerForm";

const BannersTable = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userBanners, setUserBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBanners = async () => {
      try {
        const res = await fetch(`/api/banner/get`, {
          credentials: 'include', 
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setUserBanners(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBanners();
  }, [currentUser._id]);

  const columns = [
    {
      key: "image",
      title: "Imagen",
      render: (banner) => (
        <div className="shrink-0">
          <img
            src={banner.imageUrl}
            alt="banner"
            className="h-16 w-32 object-cover rounded-md"
          />
        </div>
      ),
    },
    {
      key: "name",
      title: "Nombre",
    },
    {
      key: "priority",
      title: "Prioridad",
    },
  ];

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleBannerDelete = async (banner) => {
    try {
      const res = await fetch(`/api/banner/delete/${banner._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserBanners((prev) =>
        prev.filter((bannerA) => bannerA._id !== banner._id)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateSuccess = (updatedBanner) => {
    setUserBanners((prev) =>
      prev.map((banner) =>
        banner._id === updatedBanner._id ? updatedBanner : banner
      )
    );
    setShowForm(false);
    setEditingBanner(null);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingBanner(null);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando banners...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4">
        {showForm ? "Editar Banner" : "Tus Banners"}
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
          <UpdateBannerForm
            banner={editingBanner}
            currentUser={currentUser}
            onSuccess={handleUpdateSuccess}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <>
          {userBanners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No tienes banners registrados
              </p>
              <Link
                to="/create-banner"
                className="inline-block px-4 py-2 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white rounded-lg"
              >
                Crear primer banner
              </Link>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={userBanners}
              onEdit={handleEdit}
              onDelete={handleBannerDelete}
              pagination={true}
              itemsPerPage={5}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BannersTable;
