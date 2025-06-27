import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import DataTable from "./DataTable";
import UpdateUserForm from "./UpdateUserForm";

const UsersTable = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("/api/user/", {
            headers: {
                'Content-Type': 'application/json',
              },
        });
        const data = await res.json();
        console.log(data);
        

        if (!res.ok) {
          throw new Error(data.message || "Error al cargar usuarios");
        }

        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === "admin") {
      fetchAllUsers();
    }
  }, [currentUser]);

  const columns = [
    {
      key: "avatar",
      title: "Avatar",
      render: (user) => (
        <div className="shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="user avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-sm">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "username",
      title: "Usuario",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "role",
      title: "Rol",
      render: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Registro",
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
  ];

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleUserDelete = async (user) => {
    if (
      !window.confirm(`¿Estás seguro de eliminar al usuario ${user.username}?`)
    )
      return;

    try {
      const res = await fetch(`/api/user/delete/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.access_token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al eliminar usuario");
      }

      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateSuccess = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    setShowForm(false);
    setEditingUser(null);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4">
        {showForm ? "Editar Usuario" : "Todos los Usuarios"}
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
          <UpdateUserForm
            user={editingUser}
            currentUser={currentUser}
            onSuccess={handleUpdateSuccess}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          onEdit={currentUser.role === "admin" ? handleEdit : null}
          onDelete={currentUser.role === "admin" ? handleUserDelete : null}
          pagination={true}
          itemsPerPage={10}
        />
      )}
    </div>
  );
};

export default UsersTable;
