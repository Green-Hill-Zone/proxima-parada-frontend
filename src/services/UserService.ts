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
