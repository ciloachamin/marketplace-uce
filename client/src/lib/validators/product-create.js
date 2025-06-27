import { z } from "zod";
export const productSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(62, "El nombre no puede exceder los 62 caracteres")
    .trim(),

  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim(),

  category: z.string().min(1, "Debes seleccionar una categoría"),

  brand: z
    .string()
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(50, "La marca no puede exceder los 50 caracteres")
    .trim()
    .transform((val) => val === "" ? undefined : val) // Convierte "" en undefined
    .optional(), // Ahora sí es verdaderamente opcional

  price: z
    .number({ invalid_type_error: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo"),

  stock: z
    .number({ invalid_type_error: "El stock debe ser un número" })
    .min(1, "Debe haber al menos un producto en stock"),

  discount: z
    .number({ invalid_type_error: "El descuento debe ser un número" })
    .min(0, "El descuento no puede ser negativo"),

  campus: z.enum(["matriz", "iasa-1", "santo-domingo", "latacunga"], {
    errorMap: () => ({ message: "Selecciona un campus válido" }),
  }),

  imageUrls: z
    .array(z.string().url("Debe ser una URL válida"))
    .min(1, "Debes subir al menos una imagen")
    .max(6, "Solo puedes subir hasta 6 imágenes"),
});