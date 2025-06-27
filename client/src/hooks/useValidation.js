import { useState } from 'react';
import { z } from 'zod';

export const useValidation = (schema) => {
  const [errors, setErrors] = useState({});

  // Validar todo el formulario
  const validateForm = (formData) => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMap = {};
        err.errors.forEach((e) => {
          // Solo mostrar errores para campos no opcionales con valores
          if (!(e.code === 'invalid_type' && e.received === 'undefined')) {
            errorMap[e.path[0]] = e.message;
          }
        });
        setErrors(errorMap);
      }
      return false;
    }
  };

  // Validar un campo individual con manejo de opcionales
  const validateField = async (fieldName, value) => {
    // Si el campo está vacío y es opcional, lo consideramos válido
    if (value === "" || value === undefined) {
      const fieldSchema = schema.shape[fieldName];
      if (fieldSchema.isOptional() || fieldSchema.isNullable()) {
        setErrors(prev => ({ ...prev, [fieldName]: '' }));
        return true;
      }
    }

    const singleFieldSchema = schema.pick({ [fieldName]: true });
    
    try {
      await singleFieldSchema.parseAsync({ [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: err.errors[0]?.message || 'Campo inválido',
        }));
      }
      return false;
    }
  };

  return { errors, validateForm, validateField, setErrors };
};