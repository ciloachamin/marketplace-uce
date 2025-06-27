export const createInputClassNameGetter = (errors) => {
    return (fieldName) => {
      const baseClasses = "w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90";
      return errors[fieldName] 
        ? `${baseClasses} border-red-500 focus:ring-red-500` 
        : baseClasses;
    };
  };


  export const formatDateTime = (isoString) => {
    const d = new Date(isoString);
  
    const datePart = d.toLocaleDateString("es-EC", {
      day:   "numeric",
      month: "numeric",
      year:  "numeric",
    });
  
    const timePart = d.toLocaleTimeString("es-EC", {
      hour:   "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  
    return `${datePart}, ${timePart}`;
  };
  

  export function toLocalDateTimeInputValue(date) {
    if (!date) return "";
    
    // Acepta tanto strings ISO como objetos Date
    const d = date instanceof Date ? date : new Date(date);
    
    // Compensación de zona horaria
    const offset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() - offset);
    
    return localDate.toISOString().slice(0, 16);
  }