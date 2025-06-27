import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryForm from "../components/UpdateCategoryForm";
import DataTable from "./DataTable";
import { FaStore, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from "../redux/reducers/categorySlice";

const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/get");
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    {
      key: "image",
      title: "Imagen",
      render: (category) => (
        <div className="shrink-0">
          <img
            src={category.image}
            alt={category.name}
            className="h-16 w-16 object-cover rounded-md"
          />
        </div>
      ),
    },
    {
      key: "name",
      title: "Nombre",
    },
    {
      key: "slug",
      title: "Slug",
    },
  ];

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setShowForm(true);
  };

  const handleCreate = () => {
    setCurrentCategory(null);
    setShowForm(true);
  };

  const handleDelete = async (category) => {
    try {
      const res = await fetch(`/api/category/delete/${category._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.error(data.message);
        return;
      }
      dispatch(fetchCategories());
      setCategories((prev) => prev.filter((c) => c._id !== category._id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSuccess = (category, isNew) => {
    if (isNew) {
      setCategories((prev) => [...prev, category]);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c._id === category._id ? category : c))
      );
    }
    setShowForm(false);
    setCurrentCategory(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentCategory(null);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-800">
          {showForm
            ? currentCategory
              ? "Editar Categoría"
              : "Crear Categoría"
            : "Todas las Categorías"}
        </h2>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-gradient-to-r from-primary to-black text-white rounded-lg hover:bg-gradient-to-r hover:to-primary hover:from-black"
          >
            + Nueva Categoría
          </button>
        )}
      </div>

      {showForm ? (
        <div>
          <button
            onClick={handleCancel}
            className="mb-4 flex items-center text-primary hover:text-primary/70 font-medium"
          >
            <FaArrowLeft size={16} className="mr-2 " />
            Volver a la lista
          </button>
          <CategoryForm
            category={currentCategory}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No hay categorías registradas
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              pagination={true}
              itemsPerPage={5}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CategoriesTable;
