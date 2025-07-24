// Constantes para validação

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CPF_LENGTH: 11,
  PHONE_LENGTH: 11,
} as const;

export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Digite um email válido",
  INVALID_CPF: "CPF deve ter 11 dígitos",
  INVALID_PHONE: "Telefone deve ter 11 dígitos",
  PASSWORDS_DONT_MATCH: "As senhas não coincidem",
  REQUIRED_FIELD: "Este campo é obrigatório",
} as const;

export const FIELD_LIMITS = {
  CPF_MAX_LENGTH: 14, // Com máscara: 123.456.789-01
  PHONE_MAX_LENGTH: 15, // Com máscara: (11) 12345-6789
} as const;
