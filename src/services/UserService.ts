import axios from 'axios';

interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  document?: string;
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3001', // ou o endereço onde está rodando o json-server
});

export const createUser = async (user: Omit<User, 'createdAt' | 'updatedAt' | 'id'>): Promise<User> => {
  const response = await api.post('/Users', user);
  return response.data;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const response = await api.get<User[]>(`/Users?email=${encodeURIComponent(email)}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/Users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const response = await api.get<User>(`/Users/${id}`);
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
}