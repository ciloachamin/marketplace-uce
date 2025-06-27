import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DataTable from "./DataTable";
import UpdateProductForm from "./UpdateProductForm";

const ProductsTable = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const res = await fetch(`/api/user/products/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setUserProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [currentUser._id]);

  const columns = [
    {
      key: "image",
      title: "Imagen",
      render: (product) => (
        <Link to={`/product/${product._id}`} className="shrink-0">
          <img
            src={product.imageUrls[0]}
            alt="product cover"
            className="h-16 w-16 object-cover rounded-md"
          />
        </Link>
      ),
    },
    {
      key: "name",
      title: "Nombre",
    },
    {
      key: "category",
      title: "Categoría",
    },
    {
      key: "price",
      title: "Precio",
      render: (product) => `$${product.price}`,
    },
    {
      key: "stock",
      title: "Stock",
    },
  ];

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleProductDelete = async (product) => {
    try {
      const res = await fetch(`/api/product/delete/${product._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserProducts((prev) =>
        prev.filter((productA) => productA._id !== product._id)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setUserProducts((prev) =>
      prev.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4">
        {showForm ? "Editar Producto" : "Tus Productos"}
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
          <UpdateProductForm
            product={editingProduct}
            currentUser={currentUser}
            onSuccess={handleUpdateSuccess}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <>
          {userProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No tienes productos registrados
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={userProducts}
              onEdit={handleEdit}
              onDelete={handleProductDelete}
              pagination={true}
              itemsPerPage={5}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductsTable;
