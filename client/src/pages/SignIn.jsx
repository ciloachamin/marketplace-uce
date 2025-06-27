import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { Icons } from "../components/Icons";
import OAuth from "../components/OAuth";
import { useValidation } from "../hooks/useValidation";
import { signInSchema } from "../lib/validators/auth-schema";
import { createInputClassNameGetter } from "../utils/formUtils";
import { FaArrowRight } from "react-icons/fa";
import { authFetch } from "../utils/api";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validación con Zod
  const { errors, validateForm, validateField } = useValidation(signInSchema);
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
      dispatch(signInStart());
      const res = await authFetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("asss", data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto pb-10">
      <div className="flex flex-col items-center space-y-2 text-center my-10">
        <Icons.logo className="h-20 w-20" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Inicia sesión en tu cuenta
        </h1>
        <Link
          to="/sign-up"
          className=" text-primary hover:text-primary/60 text-sm flex items-center gap-1"
          aria-label="¿No tienes una cuenta? Regístrate aquí"
        >
          ¿No tienes una cuenta?
          <FaArrowRight size={16} className="ml-2 " />
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
            autoComplete="current-password"
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
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>

        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>¿No tienes una cuenta?</p>
        <Link to={"/sign-up"}>
          <span className=" text-primary">Regístrate</span>
        </Link>
      </div>

      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
