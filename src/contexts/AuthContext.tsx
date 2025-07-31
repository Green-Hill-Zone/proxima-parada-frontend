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
import { mockTravelPackages, mockUsers } from './mockData';
import type { AuthContextType, TravelPackage, User } from './types';

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
          avatar: foundUser.avatar,
          // Inclui todas as informações pessoais
          birthDate: foundUser.birthDate,
          cpf: foundUser.cpf,
          gender: foundUser.gender,
          phone: foundUser.phone,
          phone2: foundUser.phone2,
          memberSince: foundUser.memberSince,
          // Inclui informações de endereço
          cep: foundUser.cep,
          street: foundUser.street,
          streetNumber: foundUser.streetNumber,
          complement: foundUser.complement,
          neighborhood: foundUser.neighborhood,
          city: foundUser.city,
          state: foundUser.state,
          country: foundUser.country
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

      // Cria objeto do novo usuário com informações padrão para novos cadastros
      const newUser: User = {
        id: Date.now().toString(),              // ID único baseado em timestamp
        name,                                   // Nome fornecido
        email,                                  // Email fornecido
        avatar: `https://via.placeholder.com/150/007bff/fff?text=${name.charAt(0).toUpperCase()}`, // Avatar placeholder
        // Informações padrão para novos usuários (podem ser editadas no perfil depois)
        birthDate: '01/01/1990',              // Data padrão
        cpf: '000.000.000-00',                // CPF a ser preenchido
        gender: 'Não informado',              // Gênero a ser preenchido
        phone: '(00) 00000-0000',             // Telefone a ser preenchido
        phone2: '(00) 00000-0000',            // Telefone 2 a ser preenchido
        memberSince: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }), // Data atual
        // Informações de endereço padrão (a serem preenchidas)
        cep: '00000-000',
        street: 'A definir',
        streetNumber: '0',
        complement: '',
        neighborhood: 'A definir',
        city: 'A definir',
        state: 'SP',
        country: 'Brasil'
      };

      // Adiciona aos dados simulados (em produção seria enviado para API)
      mockUsers.push({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password,                               // Senha (em produção seria hash)
        avatar: newUser.avatar || '',
        birthDate: newUser.birthDate,
        cpf: newUser.cpf,
        gender: newUser.gender,
        phone: newUser.phone,
        phone2: newUser.phone2 || '',
        memberSince: newUser.memberSince,
        // Informações de endereço padrão
        cep: newUser.cep,
        street: newUser.street,
        streetNumber: newUser.streetNumber,
        complement: newUser.complement || '',
        neighborhood: newUser.neighborhood,
        city: newUser.city,
        state: newUser.state,
        country: newUser.country || 'Brasil'
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
  /* FUNÇÃO PARA BUSCAR VIAGENS DO USUÁRIO                           */
  /* ================================================================= */

  // Função para buscar as viagens de um usuário específico
  const getUserTravels = (userId: string): TravelPackage[] => {
    return mockTravelPackages[userId] || [];
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