import { useCallback, useState } from "react";
import { formatCPF, formatPhone, removeNonDigits } from "../utils/formatters";
import { ERROR_MESSAGES, VALIDATION_RULES } from "../utils/validationConstants";

export interface UserRegisterFormData {
  email: string;
  phone: string;
  document: string;
  password: string;
  confirmPassword: string;
}

type ValidationErrors = { [key: string]: string };

export const useUserRegistration = (
  initialData?: Partial<UserRegisterFormData>
) => {
  const [formData, setFormData] = useState<UserRegisterFormData>({
    email: "",
    phone: "",
    document: "",
    password: "",
    confirmPassword: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = useCallback((email: string): boolean => {
    return VALIDATION_RULES.EMAIL_REGEX.test(email);
  }, []);

  const validateField = useCallback(
    (field: keyof UserRegisterFormData, value: string): string | null => {
      switch (field) {
        case "email":
          return value && !validateEmail(value)
            ? ERROR_MESSAGES.INVALID_EMAIL
            : null;

        case "document":
          const cpfNumbers = removeNonDigits(value);
          return cpfNumbers.length > 0 &&
            cpfNumbers.length !== VALIDATION_RULES.CPF_LENGTH
            ? ERROR_MESSAGES.INVALID_CPF
            : null;

        case "phone":
          const phoneNumbers = removeNonDigits(value);
          return phoneNumbers.length > 0 &&
            phoneNumbers.length !== VALIDATION_RULES.PHONE_LENGTH
            ? ERROR_MESSAGES.INVALID_PHONE
            : null;

        case "confirmPassword":
          return value && value !== formData.password
            ? ERROR_MESSAGES.PASSWORDS_DONT_MATCH
            : null;

        default:
          return null;
      }
    },
    [formData.password, validateEmail]
  );

  const handleInputChange = useCallback(
    (field: keyof UserRegisterFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Aplicar máscaras
        if (field === "document") {
          value = formatCPF(value);
        } else if (field === "phone") {
          value = formatPhone(value);
        }

        // Validar campo
        const error = validateField(field, value);

        setErrors((prev) => ({
          ...prev,
          [field]: error || "",
        }));

        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
    [validateField]
  );

  const validateAllFields = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // Validar todos os campos usando a função validateField
    // que já contém toda a lógica de validação necessária
    Object.keys(formData).forEach((key) => {
      const field = key as keyof UserRegisterFormData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  return {
    formData,
    errors,
    handleInputChange,
    validateAllFields,
    setFormData,
    setErrors,
  };
};
