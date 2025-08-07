/* ===================================================================== */
/* TIPOS E INTERFACES DO SISTEMA DE AUTENTICAÇÃO                        */
/* ===================================================================== */

// Interface para dados de viagem/pacote
export interface TravelPackage {
  id: string;              // ID único da viagem
  title: string;           // Nome do pacote
  destination: string;     // Destino principal
  startDate: string;       // Data de início (DD/MM/AAAA)
  endDate: string;         // Data de fim (DD/MM/AAAA)
  duration: number;        // Duração em dias
  price: number;           // Preço pago
  status: 'completed' | 'upcoming' | 'cancelled'; // Status da viagem
  imageUrl: string;        // URL da imagem do destino
  description: string;     // Descrição do pacote
  includes: string[];      // O que está incluso
  category: string;        // Categoria (Praia, Montanha, Cidade, etc.)
  rating?: number;         // Avaliação dada pelo usuário (1-5)
  review?: string;         // Comentário do usuário
}

// Interface que define a estrutura dos dados do usuário
export interface User {
  id: string;           // ID único do usuário
  name: string;         // Nome completo do usuário
  email: string;        // Email (usado como login)
  avatar?: string;      // URL do avatar (opcional)
  role?: string;        // Role do usuário (admin, user)
  isEmailConfirmed?: boolean; // Status de confirmação do email
  // Novas informações pessoais
  birthDate: string;    // Data de nascimento (formato: DD/MM/AAAA)
  cpf: string;          // CPF formatado (formato: XXX.XXX.XXX-XX)
  gender: string;       // Gênero (Masculino, Feminino, Outro)
  phone: string;        // Telefone com DDD (formato: (XX) XXXXX-XXXX)
  phone2?: string;      // Telefone 2 (opcional)
  memberSince: string;  // Data de cadastro (formato: Mês AAAA)
  // Informações de endereço
  cep: string;          // CEP (formato: XXXXX-XXX)
  street: string;       // Logradouro/Rua
  streetNumber: string; // Número
  complement?: string;  // Complemento (opcional)
  neighborhood: string; // Bairro
  city: string;         // Cidade
  state: string;        // Estado/UF
  country?: string;     // País (opcional)
}

// Interface que define a estrutura do contexto de autenticação
export interface AuthContextType {
  user: User | null;                    // Usuário atual (null se não logado)
  isLoading: boolean;                   // Estado de carregamento (útil para spinners)
  login: (email: string, password: string) => Promise<boolean>; // Função de login assíncrona
  logout: () => void;                   // Função de logout
  register: (name: string, email: string, password: string) => Promise<boolean>; // Função de cadastro
  updateUser: (updatedUser: User) => void; // Função para atualizar dados do usuário no contexto
  getUserTravels: (userId: string) => Promise<TravelPackage[]>; // Função assíncrona para buscar viagens do usuário
}
