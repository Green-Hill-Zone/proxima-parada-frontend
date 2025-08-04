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
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

// Importações dos tipos e dados separados
import { AuthContext } from './authContext';
import { mockTravelPackages } from './mockData';
import type { AuthContextType, TravelPackage, User } from './types';

// Importação do serviço real de usuários
import { createUser, loginUser, adaptUserToAuthUser, type CreateUserRequest } from '../services/UserService';

// Interface para as props do provider
interface AuthProviderProps {
  children: ReactNode;  // Componentes filhos que terão acesso ao contexto
}

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

  // Função de login que autentica com backend real
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true); // Ativa estado de carregamento

    try {
      console.log('🔄 Realizando login com backend...', { email });
      
      // Chama o serviço real de login
      const userData = await loginUser({ email, password });

      if (userData) {
        // ✅ LOGIN BEM-SUCEDIDO
        console.log('✅ Login realizado com sucesso:', userData);
        
        // Verifica se há dados salvos do usuário para preservar informações extras
        const savedUserData = localStorage.getItem('currentUser');
        let existingData: User | null = null;
        
        if (savedUserData) {
          try {
            existingData = JSON.parse(savedUserData);
          } catch (error) {
            console.log('Dados salvos inválidos, usando dados padrão');
          }
        }
        
        // Adapta dados do backend preservando informações locais
        const authUserData = adaptUserToAuthUser(userData, existingData || undefined);
        
        // Atualiza o estado da aplicação
        setUser(authUserData);

        // Salva no localStorage para persistir a sessão
        localStorage.setItem('currentUser', JSON.stringify(authUserData));

        return true; // Retorna true indicando sucesso

      } else {
        // ❌ CREDENCIAIS INVÁLIDAS
        console.log('❌ Credenciais inválidas ou usuário não encontrado');
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

  // Função de cadastro que cria usuário no backend real
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true); // Ativa estado de carregamento

    try {
      console.log('🔄 Criando usuário no backend...', { name, email });
      
      // Prepara dados para envio ao backend
      const createUserData: CreateUserRequest = {
        name,
        email,
        password,
        role: 'customer', // Role padrão para novos usuários
      };

      // Chama o serviço real de criação de usuário
      const newUser = await createUser(createUserData);

      // ✅ USUÁRIO CRIADO COM SUCESSO
      console.log('✅ Cadastro realizado com sucesso:', newUser);

      // Adapta dados do backend para o formato do contexto de autenticação (sem dados anteriores no registro)
      const authUserData = adaptUserToAuthUser(newUser, undefined);

      // Atualiza estado e salva sessão (auto-login após cadastro)
      setUser(authUserData);
      localStorage.setItem('currentUser', JSON.stringify(authUserData));

      return true;

    } catch (error) {
      // ⚠️ ERRO DURANTE O CADASTRO
      console.error('Erro durante o cadastro:', error);
      
      // Mostra mensagens de erro mais específicas se possível
      if (error instanceof Error) {
        console.error('Detalhes do erro:', error.message);
      }
      
      return false;
    } finally {
      // Sempre desativa o loading
      setIsLoading(false);
    }
  };

  /* ================================================================= */
  /* FUNÇÃO PARA BUSCAR VIAGENS DO USUÁRIO                           */
  /* ================================================================= */

  // Função para buscar as viagens de um usuário específico
  const getUserTravels = (userId: string): TravelPackage[] => {
    return mockTravelPackages[userId] || [];
  };

  /* ================================================================= */
  /* FUNÇÃO PARA ATUALIZAR DADOS DO USUÁRIO NO CONTEXTO              */
  /* ================================================================= */

  // Função para atualizar os dados do usuário no contexto após edição
  const updateUser = (updatedUser: User): void => {
    console.log('🔄 Atualizando usuário no contexto:', updatedUser);
    
    // Atualiza o estado do usuário
    setUser(updatedUser);
    
    // Atualiza também no localStorage para persistir
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    console.log('✅ Usuário atualizado no contexto com sucesso');
  };

  /* ================================================================= */
  /* CONFIGURAÇÃO DO VALOR DO CONTEXTO                               */
  /* ================================================================= */

  // Objeto que será fornecido pelo contexto para todos os componentes filhos
  const contextValue: AuthContextType = {
    user,           // Estado atual do usuário
    isLoading,      // Estado de carregamento
    login,          // Função de login
    logout,         // Função de logout
    register,       // Função de cadastro
    updateUser,     // Função para atualizar usuário no contexto
    getUserTravels  // Função para buscar viagens
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

export default AuthProvider;