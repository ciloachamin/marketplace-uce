import * as z from 'zod';

export const reviewSchema = z.object({
  rating: z.number()
    .min(1, "Debes seleccionar una calificación")
    .max(5, "La calificación máxima es 5"),
  review: z.string()
    .min(10, "La reseña debe tener al menos 10 caracteres")
    .max(500, "La reseña no puede exceder los 500 caracteres")
});