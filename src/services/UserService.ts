import axios from 'axios';
import type { User as AuthUser } from '../contexts/types';

// URL base da API - deve corresponder ao backend .NET
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||'http://localhost:5079/api';

/* ===================================================================== */
/* INTERFACES E TIPOS                                                   */
/* ===================================================================== */

// Interface do usuário simplificada (backend)
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  document?: string;
  companyId?: number;
  isEmailConfirmed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para criação de usuário (com senha)
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  document?: string;
  companyId?: number;
}

// Interface para atualização de usuário (sem senha)
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  document?: string;
  companyId?: number;
}

// Interface para login
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface da resposta do backend (AppUserDto)
interface BackendUserDto {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  document?: string;
  companyId?: number;
}

// Interface da resposta de criação de usuário
interface CreateUserResponse {
  userId: number;
}

/* ===================================================================== */
/* FUNÇÕES DE MAPEAMENTO E ADAPTAÇÃO                                     */
/* ===================================================================== */

// Mapeia dados do backend (AppUserDto) para o frontend (User)
const mapBackendToFrontend = (backendUser: BackendUserDto): User => {
  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    role: backendUser.role || 'customer',
    phone: backendUser.phone,
    document: backendUser.document,
    companyId: backendUser.companyId,
    isEmailConfirmed: false, // Valor padrão, pode ser ajustado conforme backend
  };
};

// Adapta User (backend) para AuthUser (contexto de autenticação)
export const adaptUserToAuthUser = (user: User, existingData?: AuthUser): AuthUser => {
  return {
    id: user.id.toString(), // AuthUser usa string, User usa number
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: `https://via.placeholder.com/150/007bff/fff?text=${user.name.charAt(0).toUpperCase()}`,
    // Preserva informações existentes ou usa padrões
    birthDate: existingData?.birthDate || '01/01/1990',
    cpf: existingData?.cpf || user.document || '000.000.000-00',
    gender: existingData?.gender || 'Não informado',
    phone: user.phone || existingData?.phone || '(00) 00000-0000',
    phone2: existingData?.phone2 || '(00) 00000-0000',
    memberSince: existingData?.memberSince || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    // Informações de endereço preservadas ou padrão
    cep: existingData?.cep || '00000-000',
    street: existingData?.street || 'A definir',
    streetNumber: existingData?.streetNumber || '0',
    complement: existingData?.complement || '',
    neighborhood: existingData?.neighborhood || 'A definir',
    city: existingData?.city || 'A definir',
    state: existingData?.state || 'SP',
    country: existingData?.country || 'Brasil'
  };
};

// Mapeia dados do frontend para envio ao backend
const mapFrontendToBackend = (createRequest: CreateUserRequest): BackendUserDto => {
  return {
    id: 0, // Será definido pelo backend
    name: createRequest.name,
    email: createRequest.email,
    password: createRequest.password,
    role: createRequest.role || 'customer',
    phone: createRequest.phone,
    document: createRequest.document,
    companyId: createRequest.companyId,
  };
};

// Mapeia dados de atualização do frontend para o backend
const mapUpdateToBackend = (id: number, updateRequest: UpdateUserRequest, currentPassword: string = ''): BackendUserDto => {
  return {
    id,
    name: updateRequest.name || '',
    email: updateRequest.email || '',
    password: currentPassword, // Mantém a senha atual se não fornecida
    role: updateRequest.role || 'customer',
    phone: updateRequest.phone,
    document: updateRequest.document,
    companyId: updateRequest.companyId,
  };
};

/* ===================================================================== */
/* SERVIÇOS DE API                                                       */
/* ===================================================================== */

/**
 * Registra um novo usuário no sistema
 * @param userData - Dados do usuário para criar
 * @returns Promise com o usuário criado ou erro
 */

export const createUser = async (formData: any) => {
  try {
    const response = await axios.post('https://localhost:7102/api/AppUser/create', formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Deixa o tratamento na tela fazer o resto
      throw error;
    }

    // Se for outro erro (não-Axios), lança um erro genérico
    throw new Error('Erro inesperado ao registrar usuário');
  }
};

/**
 * Busca usuário por ID
 * @param id - ID do usuário
 * @returns Promise com dados do usuário
 */
export const getUserById = async (id: number): Promise<User> => {
  try {
    console.log(`🔄 Buscando usuário por ID: ${id}`);
    
    const response = await axios.get(
      `${API_BASE_URL}/AppUser/${id}`
    );

    console.log('📋 Resposta do getUserById:', response.data);
    console.log('✅ Usuário encontrado:', response.data.email);
    
    // Mapeia dados do backend para frontend
    return mapBackendToFrontend(response.data);
    
  } catch (error) {
    console.error('❌ Erro ao buscar usuário por ID:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Usuário não encontrado');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Busca usuário por email (para login)
 * @param email - Email do usuário
 * @returns Promise com dados do usuário ou null se não encontrado
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    console.log(`🔄 Buscando usuário por email: ${email}`);
    
    // Busca todos os usuários e filtra por email
    // Nota: Idealmente o backend deveria ter um endpoint específico para busca por email
    const response = await axios.get(
      `${API_BASE_URL}/AppUser`
    );

    console.log('📋 Resposta bruta do backend:', response.data);

    // O backend .NET retorna no formato ReferenceHandler.Preserve: {"$id":"1","$values":[...]}
    let usersList: BackendUserDto[];
    
    if (response.data && typeof response.data === 'object' && '$values' in response.data) {
      // Formato ReferenceHandler.Preserve
      usersList = response.data.$values;
      console.log(`✅ Lista de usuários (ReferenceHandler): Total: ${usersList.length}`);
    } else if (Array.isArray(response.data)) {
      // Formato array direto
      usersList = response.data;
      console.log(`✅ Lista de usuários (Array): Total: ${usersList.length}`);
    } else {
      console.error('❌ Formato de resposta inesperado:', response.data);
      throw new Error('Formato de resposta do servidor inválido');
    }
    
    // Procura o usuário com o email especificado
    const foundUser = usersList.find(user => user.email === email);
    
    if (foundUser) {
      console.log('✅ Usuário encontrado por email:', foundUser.email);
      return mapBackendToFrontend(foundUser);
    } else {
      console.log('❌ Usuário não encontrado por email');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Erro ao buscar usuário por email:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Simula login verificando email e senha
 * Nota: Em produção, isso seria feito pelo backend com hash de senha
 * @param loginData - Dados de login (email e senha)
 * @returns Promise com dados do usuário ou null se credenciais inválidas
 */
export const loginUser = async (loginData: LoginRequest): Promise<User | null> => {
  try {
    console.log(`🔄 Tentativa de login: ${loginData.email}`);
    
    // Busca o usuário por email
    const user = await getUserByEmail(loginData.email);
    
    if (!user) {
      console.log('❌ Usuário não encontrado para login');
      return null;
    }

    // Nota: Em produção, a validação da senha seria feita pelo backend
    // Aqui estamos simulando que o login sempre é bem-sucedido se o usuário existe
    // Para implementar validação real, seria necessário um endpoint /login no backend
    
    console.log('✅ Login simulado bem-sucedido:', user.email);
    return user;
    
  } catch (error) {
    console.error('❌ Erro durante login:', error);
    throw error;
  }
};

/**
 * Busca todos os usuários (para uso administrativo)
 * @returns Promise com lista de usuários
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    console.log('🔄 Buscando todos os usuários...');
    
    const response = await axios.get(
      `${API_BASE_URL}/AppUser`
    );

    console.log('📋 Resposta bruta do backend:', response.data);

    // O backend .NET retorna no formato ReferenceHandler.Preserve: {"$id":"1","$values":[...]}
    let usersList: BackendUserDto[];
    
    if (response.data && typeof response.data === 'object' && '$values' in response.data) {
      // Formato ReferenceHandler.Preserve
      usersList = response.data.$values;
      console.log(`✅ Lista de usuários (ReferenceHandler): Total: ${usersList.length}`);
    } else if (Array.isArray(response.data)) {
      // Formato array direto
      usersList = response.data;
      console.log(`✅ Lista de usuários (Array): Total: ${usersList.length}`);
    } else {
      console.error('❌ Formato de resposta inesperado:', response.data);
      throw new Error('Formato de resposta do servidor inválido');
    }
    
    // Mapeia todos os usuários do backend para frontend
    return usersList.map(mapBackendToFrontend);
    
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

/**
 * Atualiza dados de um usuário existente
 * @param id - ID do usuário a ser atualizado
 * @param updateData - Dados a serem atualizados
 * @returns Promise com os dados atualizados do usuário
 */
export const updateUser = async (id: number, updateData: UpdateUserRequest): Promise<User> => {
  try {
    console.log(`🔄 Atualizando usuário ID: ${id}`, updateData);
    
    // Primeiro, busca os dados atuais do usuário para manter campos não editados
    const currentUser = await getUserById(id);
    
    // Prepara dados para envio, mesclando dados atuais com atualizações
    const updatedData = {
      id,
      name: updateData.name ?? currentUser.name,
      email: updateData.email ?? currentUser.email,
      password: '', // O backend deve manter a senha atual se vazio
      role: updateData.role ?? currentUser.role,
      phone: updateData.phone ?? currentUser.phone,
      document: updateData.document ?? currentUser.document,
      companyId: updateData.companyId ?? currentUser.companyId,
    };

    console.log('📤 Dados sendo enviados para atualização:', updatedData);
    
    // Faz a requisição PUT para atualizar usuário
    const response = await axios.put(
      `${API_BASE_URL}/AppUser/${id}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📋 Resposta da atualização:', response.data);
    console.log('✅ Usuário atualizado com sucesso');

    // Busca os dados atualizados do usuário
    const updatedUser = await getUserById(id);
    return updatedUser;
    
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Usuário não encontrado');
      }
      if (error.response?.status === 400) {
        throw new Error('Dados inválidos fornecidos');
      }
      if (error.response?.status === 409) {
        throw new Error('Email já está em uso por outro usuário');
      }
      throw new Error(`Erro do servidor: ${error.response?.status}`);
    }
    
    throw new Error('Erro de conexão com o servidor');
  }
};

// Exportações para compatibilidade
export { createUser as default };

