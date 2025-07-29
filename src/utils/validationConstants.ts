// Constantes para validação

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CPF_LENGTH: 11,
  PHONE_LENGTH: 11,
  MIN_PASSWORD_LENGTH: 6,
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "Este campo é obrigatório",
  INVALID_EMAIL: "Email inválido",
  INVALID_CPF: "CPF inválido",
  INVALID_PHONE: "Telefone inválido",
  PASSWORDS_DONT_MATCH: "As senhas não coincidem",
  PASSWORD_TOO_SHORT: "A senha deve ter pelo menos 6 caracteres",
} as const;

export const FIELD_LIMITS = {
  CPF_MAX_LENGTH: 14, // Com máscara: 123.456.789-01
  PHONE_MAX_LENGTH: 15, // Com máscara: (11) 12345-6789
} as const;
