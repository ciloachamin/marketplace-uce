import { z } from "zod";

export const shopSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(20, "El nombre no puede exceder 20 caracteres")
    .trim()
    .refine(value => /^[0-9a-zA-Z\s]+$/.test(value), {
      message: "El nombre solo puede contener letras numeros y espacios",
    }),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim(),
  address: z
    .string()
    .min(5, "Dirección inválida")
    .max(100, "La dirección no puede exceder 100 caracteres")
    .trim(),
  phone: z
    .string()
    .min(7, "Teléfono inválido")
    .max(10, "Teléfono inválido")
    .regex(/^[0-9]+$/, "Solo se permiten números"),
  category: z.enum(["restaurant", "retail", "service", "other"], {
    errorMap: () => ({ message: "Selecciona una categoría válida" }),
  }),
  socialMedia: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        value
          .split(",")
          .map((url) => url.trim())
          .every((url) => {
            try {
              new URL(url);
              return true;
            } catch (_) {
              return false;
            }
          }),
      {
        message:
          "Las redes sociales deben ser URLs válidas separadas por comas",
      }
    ),
  openingHours: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:MM)"),
  closingHours: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:MM)"),
  imageUrls: z
    .array(z.string().url("URL de imagen inválida"))
    .max(10, "Máximo 10 imágenes"),
});