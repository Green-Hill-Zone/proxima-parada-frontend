/* ===================================================================== */
/* CONTEXTO DE AUTENTICAÇÃO - GERENCIAMENTO DE ESTADO DO USUÁRIO       */
/* ===================================================================== */
/*
 * Este arquivo implementa o sistema de autenticação usando React Context API.
 * Ele fornece:
 * - Estado global do usuário logado
 * - Funções de login, logout e cadastro
 * - Persistência da sessão no localStorage
 * - Simulação de API com dados mock
 */

// Importações necessárias do React
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

/* ===================================================================== */
/* INTERFACES E TIPOS TYPESCRIPT                                        */
/* ===================================================================== */

// Interface que define a estrutura dos dados do usuário
export interface User {
  id: string;           // ID único do usuário
  name: string;         // Nome completo do usuário
  email: string;        // Email (usado como login)
  avatar?: string;      // URL do avatar (opcional)
}

// Interface que define a estrutura do contexto de autenticação
export interface AuthContextType {
  user: User | null;                    // Usuário atual (null se não logado)
  isLoading: boolean;                   // Estado de carregamento (útil para spinners)
  login: (email: string, password: string) => Promise<boolean>; // Função de login assíncrona
  logout: () => void;                   // Função de logout
  register: (name: string, email: string, password: string) => Promise<boolean>; // Função de cadastro
}

// Criação do contexto com valor padrão undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Interface para as props do provider
interface AuthProviderProps {
  children: ReactNode;  // Componentes filhos que terão acesso ao contexto
}

/* ===================================================================== */
/* DADOS SIMULADOS - BANCO DE DADOS MOCK                               */
/* ===================================================================== */

// Array de usuários simulados para teste (substitui API/banco real)
const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',                    // ✅ Email corrigido para teste
    password: '123456',                          // ✅ Senha simples para teste
    avatar: 'https://via.placeholder.com/150/007bff/fff?text=JS'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',                   // ✅ Email corrigido para teste
    password: '123456',                          // ✅ Senha simples para teste
    avatar: 'https://via.placeholder.com/150/28a745/fff?text=MS'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',                  // ✅ Email corrigido para teste
    password: '123456',                          // ✅ Senha simples para teste
    avatar: 'https://via.placeholder.com/150/dc3545/fff?text=CO'
  }
];

/* ===================================================================== */
/* PROVIDER DO CONTEXTO - COMPONENTE PRINCIPAL                         */
/* ===================================================================== */

// Provider do contexto de autenticação - envolve toda a aplicação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estados do React para gerenciar autenticação
  const [user, setUser] = useState<User | null>(null);      // Usuário atual
  const [isLoading, setIsLoading] = useState(true);         // Estado de carregamento

  /* ================================================================= */
  /* EFEITO DE INICIALIZAÇÃO - VERIFICA SESSÃO SALVA                 */
  /* ================================================================= */
  
  /* ================================================================= */
  /* EFEITO DE INICIALIZAÇÃO - VERIFICA SESSÃO SALVA                 */
  /* ================================================================= */
  
  // useEffect executa uma vez quando o componente monta
  // Verifica se há um usuário logado salvo no localStorage
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Tenta recuperar dados do usuário do localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          // Se encontrou dados salvos, converte de JSON e define como usuário atual
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        // Se houver erro (dados corrompidos), limpa o localStorage
        console.error('Erro ao verificar status de autenticação:', error);
        localStorage.removeItem('currentUser');
      } finally {
        // Sempre define isLoading como false ao final
        setIsLoading(false);
      }
    };

    // Simula um delay de carregamento (como uma chamada para API)
    // Em produção, aqui seria uma chamada real para verificar o token
    setTimeout(checkAuthStatus, 1000);
  }, []); // Array vazio = executa apenas uma vez ao montar o componente

  /* ================================================================= */
  /* FUNÇÃO DE LOGIN - AUTENTICA O USUÁRIO                           */
  /* ================================================================= */
  
  // Função de login que simula autenticação com backend
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true); // Ativa estado de carregamento

    try {
      // Simula delay de requisição para API (1.5 segundos)
      // Em produção, aqui seria: const response = await fetch('/api/login', {...})
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Busca o usuário nos dados simulados
      // Em produção, isso seria feito pelo servidor
      const foundUser = mockUsers.find(
        user => user.email === email && user.password === password
      );

      if (foundUser) {
        // ✅ USUÁRIO ENCONTRADO - LOGIN BEM-SUCEDIDO
        
        // Cria objeto User sem a senha (por segurança)
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          avatar: foundUser.avatar
        };

        // Atualiza o estado da aplicação
        setUser(userData);
        
        // Salva no localStorage para persistir a sessão
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Log para debug (em produção, remover)
        console.log('✅ Login realizado com sucesso:', userData);
        return true; // Retorna true indicando sucesso
        
      } else {
        // ❌ USUÁRIO NÃO ENCONTRADO - CREDENCIAIS INVÁLIDAS
        console.log('❌ Credenciais inválidas');
        return false; // Retorna false indicando falha
      }
      
    } catch (error) {
      // ⚠️ ERRO INESPERADO DURANTE O LOGIN
      console.error('Erro durante o login:', error);
      return false;
    } finally {
      // Sempre desativa o loading, independente do resultado
      setIsLoading(false);
    }
  };

  /* ================================================================= */
  /* FUNÇÃO DE LOGOUT - REMOVE AUTENTICAÇÃO                          */
  /* ================================================================= */
  
  // Função de logout - limpa dados do usuário
  const logout = () => {
    setUser(null);                              // Remove usuário do estado
    localStorage.removeItem('currentUser');     // Remove dados salvos
    console.log('👋 Logout realizado');         // Log para debug
  };

  /* ================================================================= */
  /* FUNÇÃO DE CADASTRO - REGISTRA NOVO USUÁRIO                      */
  /* ================================================================= */
  
  // Função de cadastro que simula criação de usuário
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true); // Ativa estado de carregamento

    try {
      // Simula delay de requisição para API
      // Em produção: const response = await fetch('/api/register', {...})
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verifica se o email já existe nos dados simulados
      const existingUser = mockUsers.find(user => user.email === email);
      if (existingUser) {
        // ❌ EMAIL JÁ EXISTE - IMPEDE CADASTRO DUPLICADO
        console.log('❌ Email já cadastrado');
        return false;
      }

      // ✅ EMAIL DISPONÍVEL - CRIA NOVO USUÁRIO
      
      // Cria objeto do novo usuário
      const newUser: User = {
        id: Date.now().toString(),              // ID único baseado em timestamp
        name,                                   // Nome fornecido
        email,                                  // Email fornecido
        avatar: `https://via.placeholder.com/150/007bff/fff?text=${name.charAt(0).toUpperCase()}` // Avatar placeholder
      };

      // Adiciona aos dados simulados (em produção seria enviado para API)
      mockUsers.push({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password,                               // Senha (em produção seria hash)
        avatar: newUser.avatar || ''
      });

      // Atualiza estado e salva sessão (auto-login após cadastro)
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      console.log('✅ Cadastro realizado com sucesso:', newUser);
      return true;
      
    } catch (error) {
      // ⚠️ ERRO INESPERADO DURANTE O CADASTRO
      console.error('Erro durante o cadastro:', error);
      return false;
    } finally {
      // Sempre desativa o loading
      setIsLoading(false);
    }
  };

  /* ================================================================= */
  /* CONFIGURAÇÃO DO VALOR DO CONTEXTO                               */
  /* ================================================================= */
  
  // Objeto que será fornecido pelo contexto para todos os componentes filhos
  const contextValue: AuthContextType = {
    user,        // Estado atual do usuário
    isLoading,   // Estado de carregamento
    login,       // Função de login
    logout,      // Função de logout
    register     // Função de cadastro
  };

  /* ================================================================= */
  /* RENDERIZAÇÃO DO PROVIDER                                         */
  /* ================================================================= */
  
  // Retorna o Provider que envolve toda a aplicação
  // Todos os componentes filhos terão acesso às funções e estado de autenticação
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
