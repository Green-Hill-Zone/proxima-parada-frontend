import axios from 'axios';
import type { User, UserCreateRequest, UserResponse } from '../Entities/User';

const api = axios.create({
  baseURL: 'http://localhost:3001', // ou o endereço onde está rodando o json-server
});

// API do backend real
const backendApi = axios.create({
  baseURL: 'https://localhost:7102', // endereço do backend ASP.NET Core
});

export const createUser = async (user: Omit<UserCreateRequest, 'createdAt' | 'updatedAt' | 'id'>): Promise<User> => {
  const response = await api.post('/Users', user);
  return response.data;
};

export const getUserByEmail = async (email: string): Promise<UserResponse | null> => {
  try {
    const response = await api.get<UserResponse[]>(`/Users?email=${encodeURIComponent(email)}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await api.get<UserResponse[]>('/Users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}

export const getUserById = async (id: number): Promise<UserResponse | null> => {
  try {
    const response = await api.get<UserResponse>(`/Users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export const updateUser = async (id: number, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> => {
  try {
    const response = await api.put<User>(`/Users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/Users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

/**
 * Solicita a recuperação de senha enviando o email para o backend
 * @param email O email do usuário que deseja recuperar a senha
 * @returns true se a solicitação foi bem-sucedida, false caso contrário
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    const response = await backendApi.post('/api/AppUser/request-password-reset', { email });
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    return false;
  }
};

/**
 * Redefine a senha do usuário usando o token de recuperação
 * @param email O email do usuário (não utilizado na requisição, mas útil para logs)
 * @param newPassword A nova senha do usuário
 * @param token O token de recuperação de senha
 * @returns true se a redefinição foi bem-sucedida, false caso contrário
 */
export const resetPassword = async (email: string, newPassword: string, token: string): Promise<boolean> => {
  try {
    // Verifica se os parâmetros obrigatórios foram fornecidos
    if (!newPassword || !token) {
      console.error('Parâmetros obrigatórios ausentes para redefinição de senha');
      return false;
    }

    console.log('Enviando requisição para reset de senha com token:', 
      token ? `${token.substring(0, 10)}...` : 'vazio');

    // Chamada à API para redefinir a senha com o formato correto
    const response = await backendApi.post('/api/AppUser/reset-password', {
      token,
      newPassword
      // Removido email, pois a API não espera este campo
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