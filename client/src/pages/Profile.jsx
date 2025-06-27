import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { FaStore } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { useValidation } from "../hooks/useValidation";
import { userSchema } from "../lib/validators/user-scherma";
import { createInputClassNameGetter } from "../utils/formUtils";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Profile() {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const {
    currentUser,
    loading: reduxLoading,
    error: reduxError,
  } = useSelector((state) => state.user);

  // Estados para manejo de imágenes
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  // Estados para solicitud de vendedor
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [requestData, setRequestData] = useState({
    hasPending: false,
    status: null,
  });

  // Estados para el formulario
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastname: "",
    phone: "",
    email: "",
    avatar: "",
  });

  // Validación con Zod
  const { errors, validateForm, validateField, setErrors } =
    useValidation(userSchema);
  const getInputClassName = createInputClassNameGetter(errors);

  // Cargar datos iniciales del usuario
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        name: currentUser.name || "",
        lastname: currentUser.lastname || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          dispatch(signOutUserSuccess());
          navigate('/sign-in');
        }
      } catch (error) {
        dispatch(signOutUserSuccess());
      }
    };
    
    if (currentUser) checkAuth();
  }, [currentUser, dispatch, navigate]);
  // Verificar estado de solicitud de vendedor
  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        const res = await fetch("/api/request/check", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setRequestData({
          hasPending: data.hasPending,
          status: data.status,
        });
      } catch (error) {
        console.error("Error checking request status:", error);
      }
    };

    if (currentUser?.role === "user") {
      checkRequestStatus();
    }
  }, [currentUser]);

  // Manejo de subida de imagen
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          setFileUploadError(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    validateField(id, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      return;
    }

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          // No enviar password si está vacío
          password: formData.password || undefined,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setErrors({});

      // Limpiar campo de contraseña después de éxito
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleRequestSeller = async () => {
    try {
      if (!currentUser.phone && !formData.phone) {
        throw new Error(
          "Debes agregar un número de teléfono antes de solicitar ser vendedor"
        );
      }

      const res = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: requestMessage }),
      });

      const data = await res.json();

      if (data.success === false) {
        throw new Error(data.message);
      }

      setRequestData({
        hasPending: true,
        status: "pending",
      });

      setIsOpen(false);
      setRequestMessage("");
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      const auth = getAuth(app);
      await firebaseSignOut(auth);
      dispatch(signOutUserSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Perfil
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Configuraciones */}
        <div className="w-full md:w-1/4">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              Configuraciones
            </h2>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-8">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                id="avatar"
                hidden
                accept="image/*"
              />
              <div className="relative mb-2">
                <img
                  onClick={() => document.getElementById("avatar").click()}
                  src={formData.avatar || currentUser.avatar}
                  alt="profile"
                  className="rounded-full h-24 w-24 object-cover cursor-pointer border-2 border-gray-200 shadow-sm transition hover:opacity-90"
                />
                <div
                  onClick={() => document.getElementById("avatar").click()}
                  className="absolute bottom-0 right-0 bg-slate-700 text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="font-medium text-gray-800">
                {currentUser.username}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{currentUser.email}</p>

              {/* Upload Status */}
              <p className="text-sm text-center">
                {fileUploadError ? (
                  <span className="text-red-500">
                    Error al cargar la imagen (la imagen debe ser menor a 2 mb)
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className="text-slate-500">{`Subiendo ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className="text-green-500">
                    ¡Imagen cargada exitosamente!
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>

            {/* Botón para solicitar ser vendedor */}
            {currentUser?.role === "user" && (
              <div className="pt-4 border-t mt-4">
                {requestData.hasPending ? (
                  <div className="text-center">
                    <p className="font-medium mb-2">
                      {requestData.status === "pending" ? (
                        <span className="text-yellow-600">
                          Solicitud en revisión
                        </span>
                      ) : requestData.status === "approved" ? (
                        <span className="text-green-600">
                          ¡Solicitud aprobada! Ahora eres vendedor Cierra sesion
                          y vuelve a iniciar sesión
                        </span>
                      ) : (
                        <span className="text-red-600">
                          Solicitud rechazada
                        </span>
                      )}
                    </p>
                    {requestData.status === "rejected" && (
                      <button
                        onClick={() => setIsOpen(true)}
                        className="cursor-default text-sm text-blue-600 hover:underline"
                      >
                        Volver a solicitar
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!currentUser.phone && !formData.phone) {
                        setShowPhoneModal(true);
                      } else {
                        setIsOpen(true);
                      }
                    }}
                    className=" w-full bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white py-3 rounded-md cursor-default transition font-medium flex items-center justify-center gap-2"
                    disabled={requestData.status === "approved"}
                  >
                    <FaStore />
                    {requestData.status === "approved"
                      ? "Ya eres vendedor"
                      : "Ser vendedor"}
                  </button>
                )}
              </div>
            )}

            {currentUser?.role === "seller" && (
              <div className="pt-4 border-t mt-4 flex gap-4 justify-center items-center">
                <FaStore className="text-blue-600 text-lg" />
                <p className="text-blue-600 text-lg">Eres vendedor</p>
              </div>
            )}

            {/* Modales */}
            {showPhoneModal && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Teléfono requerido
                    </h3>
                    <button
                      onClick={() => setShowPhoneModal(false)}
                      className="text-gray-400 hover:text-gray-500 cursor-default"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Para solicitar ser vendedor, primero debes agregar un número
                    de teléfono válido a tu perfil.
                  </p>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setShowPhoneModal(false);
                        document
                          .getElementById("phone")
                          .scrollIntoView({ behavior: "smooth" });
                        document.getElementById("phone").focus();
                      }}
                      className=" cursor-default px-4 py-2 bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white rounded-md"
                    >
                      Agregar teléfono
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isOpen && (
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Solicitud para ser vendedor
                    </h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="cursor-default text-gray-400 hover:text-gray-500 focus:outline-none "
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                    Describe por qué quieres convertirte en vendedor en nuestra
                    plataforma.
                  </p>

                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none min-h-32"
                    placeholder="Cuéntanos sobre tu negocio..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={4}
                    required
                  />

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        setRequestMessage("");
                        setIsOpen(false);
                      }}
                      className="cursor-default px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleRequestSeller}
                      disabled={!requestMessage.trim()}
                      className="cursor-default px-4 py-2 bg-gradient-to-r from-primary to-black text-white rounded-md hover:bg-gradient-to-r hover:to-primary hover:from-black  transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Enviar solicitud
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Acciones de cuenta */}
            <div className="space-y-3 mt-6">
              <button
                onClick={handleSignOut}
                className="cursor-default flex items-center gap-2 text-slate-600 hover:text-slate-900 transition w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                Cerrar sesión
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="cursor-default flex items-center gap-2 text-red-500 hover:text-red-700 transition w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Profile Form */}
        <div className="w-full md:w-3/4">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              Información del Perfil
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-1">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    placeholder="Usuario"
                    id="username"
                    className={getInputClassName("username")}
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={20}
                    pattern="[a-zA-Z0-9_]+"
                    title="Solo letras, números y guiones bajos"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    id="name"
                    className={getInputClassName("name")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={50}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Lastname */}
                <div className="space-y-1">
                  <label
                    htmlFor="lastname"
                    className="text-sm font-medium text-gray-700"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    id="lastname"
                    className={getInputClassName("lastname")}
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={50}
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastname}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    className={getInputClassName("phone")}
                    id="phone"
                    required
                    onChange={handleChange}
                    value={formData.phone}
                    maxLength={10}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Role (readonly) */}
                <div className="space-y-1">
                  <label
                    htmlFor="role"
                    className="text-sm font-medium text-gray-700"
                  >
                    Rol
                  </label>
                  <input
                    type="text"
                    placeholder="Rol"
                    id="role"
                    className="w-full border p-3 rounded-md bg-gray-50 cursor-not-allowed opacity-70 focus:outline-none"
                    value={currentUser.role}
                    readOnly
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Correo
                  </label>
                  <input
                    type="email"
                    placeholder="Correo"
                    id="email"
                    className={getInputClassName("email")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={100}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    id="password"
                    className={getInputClassName("password")}
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    maxLength={50}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Deja en blanco si no quieres cambiar la contraseña
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={reduxLoading || Object.values(errors).some(Boolean)}
                  className={`cursor-default w-full bg-gradient-to-r from-primary to-black text-white rounded-md p-3 font-medium transition ${
                    reduxLoading || Object.values(errors).some(Boolean)
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-gradient-to-r hover:to-primary hover:from-black hover:bg-green-700"
                  }`}
                >
                  {reduxLoading ? "Cargando..." : "Actualizar perfil"}
                </button>
              </div>

              {/* Messages */}
              <div>
                {reduxError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {reduxError}
                  </div>
                )}

                {updateSuccess && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm">
                    ¡Usuario actualizado exitosamente!
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title="Eliminar cuenta permanentemente"
        description="¿Estás seguro de que deseas eliminar tu cuenta? Todos tus datos serán eliminados y esta acción no se puede deshacer."
        confirmText="Eliminar cuenta"
        cancelText="Cancelar"
      />
    </div>
  );
}
