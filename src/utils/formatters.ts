// Utilitários para formatação de campos

export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, "").slice(0, 11); // Truncate to 11 digits
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "").slice(0, 11); // Truncate to 11 digits
  return numbers
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};

export const removeNonDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};
