import axios from 'axios';
import type { User as AuthUser } from '../contexts/types';
import type { User as LegacyUser, UserCreateRequest, UserResponse } from '../Entities/User';

// URL base da API - deve corresponder ao backend .NET
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102' || 'http://localhost:5079';

// Legacy API (para compatibilidade com SCRUM52)
const legacyApi = axios.create({
  baseURL: API_BASE_URL, // ou o endereço onde está rodando o json-server
});

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
  isEmailConfirmed?: boolean;
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
    isEmailConfirmed: backendUser.isEmailConfirmed || false, // Mapeia do backend
  };
};

// Adapta User (backend) para AuthUser (contexto de autenticação)
export const adaptUserToAuthUser = (user: User, existingData?: AuthUser): AuthUser => {
  return {
    id: user.id.toString(), // AuthUser usa string, User usa number
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailConfirmed: user.isEmailConfirmed, // Mapeia o status de confirmação de email
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

/* ===================================================================== */
/* SERVIÇOS DE API                                                       */
/* ===================================================================== */

/**
 * Envia email de confirmação para um usuário recém-registrado
 * @param userId - ID do usuário para enviar o email de confirmação
 * @returns Promise que resolve quando o email for enviado com sucesso
 */
export const sendEmailConfirmation = async (userId: number): Promise<void> => {
  try {
    console.log(`🔄 Enviando email de confirmação para o usuário ID: ${userId}`);
    
    await axios.post(
      `${API_BASE_URL}/api/AppUser/send-confirmation-email/${userId}`
    );
    
    console.log('✅ Email de confirmação enviado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação:', error);
    
    // Apenas logamos o erro, mas não interrompemos o fluxo
    // para não impedir o usuário de continuar usando a aplicação
    // se houver algum problema com o envio do email
  }
};

/**
 * Registra um novo usuário no sistema
 * @param formData - Dados do usuário para criar
 * @returns Promise com o usuário criado ou erro
 */
export const createUser = async (formData: any) => {
  try {
    // Adapta o formato dos dados para o esperado pelo backend
    const appUserDto = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "customer", // Papel padrão para novos usuários
      phone: formData.phone,
      document: formData.document,
      // Não enviamos confirmPassword para o backend
    };
    
    console.log('🔄 Enviando dados para criação de usuário:', appUserDto);
    
    const response = await axios.post(`${API_BASE_URL}/api/AppUser/create`, appUserDto);
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
      `${API_BASE_URL}/api/AppUser/${id}`
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
      `${API_BASE_URL}/api/AppUser`
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
      `${API_BASE_URL}/api/AppUser`
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
      `${API_BASE_URL}/api/AppUser/${id}`,
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

/**
 * Deleta um usuário do sistema
 * @param id - ID do usuário a ser deletado
 * @returns Promise<boolean> - true se a operação foi bem-sucedida
 */
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    console.log(`🔄 Deletando usuário ID: ${id}`);
    
    const response = await axios.delete(`${API_BASE_URL}/api/AppUser/${id}`);
    console.log('✅ Usuário deletado com sucesso');
    return response.status === 200 || response.status === 204;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

/**
 * Reenvia o email de confirmação para o usuário
 * @param userId O ID do usuário
 * @returns true se o reenvio foi bem-sucedido, false caso contrário
 */
export const resendEmailConfirmation = async (userId: number): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/AppUser/send-confirmation-email/${userId}`);
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao reenviar email de confirmação:', error);
    return false;
  }
};

/**
 * Verifica o status atual de confirmação de email de um usuário
 * @param userId O ID do usuário
 * @returns true se o email estiver confirmado, false caso contrário
 */
export const checkEmailConfirmationStatus = async (userId: number): Promise<boolean> => {
  try {
    console.log(`🔄 Verificando status de confirmação de email para usuário ${userId}`);
    
    const user = await getUserById(userId);
    
    console.log(`✅ Status de confirmação obtido: ${user.isEmailConfirmed ?? false}`);
    return user.isEmailConfirmed ?? false;
  } catch (error) {
    console.error('❌ Erro ao verificar status de confirmação:', error);
    return false;
  }
};

/**
 * Confirma o email do usuário usando o token de confirmação
 * @param token O token de confirmação de email
 * @returns true se a confirmação foi bem-sucedida, false caso contrário
 */
export const confirmEmail = async (token: string): Promise<boolean> => {
  try {
    console.log('🔄 Enviando requisição GET para:', `${API_BASE_URL}/api/AppUser/confirm-email?token=${token}`);
    console.log('📝 Token enviado:', token);
    
    const response = await axios.get(`${API_BASE_URL}/api/AppUser/confirm-email?token=${encodeURIComponent(token)}`);
    
    console.log('✅ Resposta recebida:', response.status, response.data);
    return response.status === 200;
  } catch (error: any) {
    console.error('❌ Erro ao confirmar email:', error);
    
    if (error.response) {
      console.error('📋 Detalhes do erro:');
      console.error('  - Status:', error.response.status);
      console.error('  - Data:', error.response.data);
      console.error('  - Headers:', error.response.headers);
    } else if (error.request) {
      console.error('📡 Sem resposta do servidor:', error.request);
    } else {
      console.error('⚙️ Erro na configuração da requisição:', error.message);
    }
    
    return false;
  }
};

/**
 * Solicita a recuperação de senha enviando o email para o backend
 * @param email O email do usuário que deseja recuperar a senha
 * @returns true se a solicitação foi bem-sucedida, false caso contrário
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/AppUser/request-password-reset`, { email });
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    return false;
  }
};

/**
 * Redefine a senha do usuário usando o token de recuperação
 * @param newPassword A nova senha do usuário
 * @param token O token de recuperação de senha
 * @returns true se a redefinição foi bem-sucedida, false caso contrário
 */
export const resetPassword = async (newPassword: string, token: string): Promise<boolean> => {
  try {
    // Verifica se os parâmetros obrigatórios foram fornecidos
    if (!newPassword || !token) {
      console.error('Parâmetros obrigatórios ausentes para redefinição de senha');
      return false;
    }

    console.log('Enviando requisição para reset de senha com token:', 
      token ? `${token.substring(0, 10)}...` : 'vazio');

    // Chamada à API para redefinir a senha com o formato correto
    const response = await axios.post(`${API_BASE_URL}/api/AppUser/reset-password`, {
      token,
      newPassword
    });
    
    console.log('Resposta do reset de senha:', response.status);
    
    // Verifique o status da resposta e retorne true se for bem-sucedido
    return response.status === 200 || response.status === 204;
  } catch (error: any) {
    // Log detalhado do erro para facilitar a depuração
    console.error('Erro ao redefinir senha:', error);
    
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Status do erro:', error.response.status);
      console.error('Dados do erro:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta (problemas de rede)
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Erro ao configurar a requisição
      console.error('Erro na configuração da requisição:', error.message);
    }
    
    return false;
  }
};

/* ===================================================================== */
/* FUNÇÕES LEGADAS DO SCRUM52 (COMPATIBILIDADE)                          */
/* ===================================================================== */

/**
 * Versão legada de criação de usuário para compatibilidade com SCRUM52
 */
export const createLegacyUser = async (user: Omit<UserCreateRequest, 'createdAt' | 'updatedAt' | 'id'>): Promise<LegacyUser> => {
  const response = await legacyApi.post('/Users', user);
  return response.data;
};

/**
 * Versão legada de busca de usuário por email para compatibilidade com SCRUM52
 */
export const getLegacyUserByEmail = async (email: string): Promise<UserResponse | null> => {
  try {
    const response = await legacyApi.get<UserResponse[]>(`/Users?email=${encodeURIComponent(email)}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

/**
 * Versão legada de busca de todos os usuários para compatibilidade com SCRUM52
 */
export const getAllLegacyUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await legacyApi.get<UserResponse[]>('/Users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

/**
 * Versão legada de busca de usuário por ID para compatibilidade com SCRUM52
 */
export const getLegacyUserById = async (id: number): Promise<UserResponse | null> => {
  try {
    const response = await legacyApi.get<UserResponse>(`/Users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};

/**
 * Versão legada de atualização de usuário para compatibilidade com SCRUM52
 */
export const updateLegacyUser = async (id: number, user: Partial<Omit<LegacyUser, 'id' | 'createdAt' | 'updatedAt'>>): Promise<LegacyUser | null> => {
  try {
    const response = await legacyApi.put<LegacyUser>(`/Users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

/**
 * Versão legada de remoção de usuário para compatibilidade com SCRUM52
 */
export const deleteLegacyUser = async (id: number): Promise<void> => {
  try {
    await legacyApi.delete(`/Users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

// Exportações para compatibilidade
export { createUser as default };

