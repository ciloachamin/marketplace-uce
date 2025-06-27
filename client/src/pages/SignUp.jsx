import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useValidation } from "../hooks/useValidation";
import { signUpSchema } from "../lib/validators/auth-schema";
import { createInputClassNameGetter } from "../utils/formUtils";
import { Icons } from "../components/Icons";
import { FaArrowRight } from "react-icons/fa";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validación con Zod
  const { errors, validateForm, validateField } = useValidation(signUpSchema);
  const getInputClassName = createInputClassNameGetter(errors);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    // Validación en tiempo real
    validateField(id, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de enviar
    if (!validateForm(formData)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include', 
      });

      const data = await res.json();

      if (data.success === false) {
        throw new Error(data.message);
      }

      navigate("/sign-in");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto pb-10">
      <div className="flex flex-col items-center space-y-2 text-center my-10">
        <Icons.logo className="h-20 w-20" />
        <h1 className="text-2xl font-semibold tracking-tight">Regístrate</h1>
        <Link
          to="/sign-in"
          className=" text-primary hover:text-primary/60 text-sm flex items-center gap-1"
          aria-label="¿No tienes una cuenta? Regístrate aquí"
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
          <FaArrowRight size={16} className="ml-2 " />
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Username */}
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Usuario"
            className={getInputClassName("username")}
            id="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => validateField("username", formData.username)}
            required
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            title="Solo letras, números y guiones bajos"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Nombre"
            className={getInputClassName("name")}
            id="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => validateField("name", formData.name)}
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
          <input
            type="text"
            placeholder="Apellido"
            className={getInputClassName("lastname")}
            id="lastname"
            value={formData.lastname}
            onChange={handleChange}
            onBlur={() => validateField("lastname", formData.lastname)}
            required
            minLength={2}
            maxLength={50}
          />
          {errors.lastname && (
            <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <input
            type="email"
            placeholder="Correo electrónico"
            className={getInputClassName("email")}
            id="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => validateField("email", formData.email)}
            required
            maxLength={100}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <input
            type="password"
            placeholder="Contraseña"
            className={getInputClassName("password")}
            id="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => validateField("password", formData.password)}
            required
            minLength={6}
            maxLength={50}
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <button
          disabled={loading || Object.values(errors).some(Boolean)}
          className={`bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black text-white p-3 rounded-lg uppercase hover:opacity-95 ${
            loading || Object.values(errors).some(Boolean) ? "opacity-80" : ""
          }`}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>¿Ya tienes una cuenta?</p>
        <Link to={"/sign-in"}>
          <span className="text-primary">Iniciar sesión</span>
        </Link>
      </div>

      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
