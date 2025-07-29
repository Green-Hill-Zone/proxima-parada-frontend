export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  document?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateRequest extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  document?: string;
}

export interface UserResponse extends Omit<User, 'password'> {
  createdAt: string;
  updatedAt: string;
}