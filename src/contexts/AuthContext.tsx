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
  // Novas informações pessoais
  birthDate: string;    // Data de nascimento (formato: DD/MM/AAAA)
  cpf: string;          // CPF formatado (formato: XXX.XXX.XXX-XX)
  gender: string;       // Gênero (Masculino, Feminino, Outro)
  phone: string;        // Telefone com DDD (formato: (XX) XXXXX-XXXX)
  memberSince: string;  // Data de cadastro (formato: Mês AAAA)
  // Informações de endereço
  cep: string;          // CEP (formato: XXXXX-XXX)
  street: string;       // Logradouro/Rua
  streetNumber: string; // Número
  complement?: string;  // Complemento (opcional)
  neighborhood: string; // Bairro
  city: string;         // Cidade
  state: string;        // Estado/UF
}

// Interface que define a estrutura do contexto de autenticação
export interface AuthContextType {
  user: User | null;                    // Usuário atual (null se não logado)
  isLoading: boolean;                   // Estado de carregamento (útil para spinners)
  login: (email: string, password: string) => Promise<boolean>; // Função de login assíncrona
  logout: () => void;                   // Função de logout
  register: (name: string, email: string, password: string) => Promise<boolean>; // Função de cadastro
  getUserTravels: (userId: string) => TravelPackage[]; // Função para buscar viagens do usuário
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
    avatar: 'https://via.placeholder.com/150/007bff/fff?text=JS',
    // Informações pessoais completas
    birthDate: '15/03/1990',
    cpf: '123.456.789-01',
    gender: 'Masculino',
    phone: '(11) 99999-1234',
    memberSince: 'Janeiro 2024',
    // Informações de endereço
    cep: '01310-100',
    street: 'Av. Paulista',
    streetNumber: '1578',
    complement: 'Apto 142',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',                   // ✅ Email corrigido para teste
    password: '123456',                          // ✅ Senha simples para teste
    avatar: 'https://via.placeholder.com/150/28a745/fff?text=MS',
    // Informações pessoais completas
    birthDate: '22/07/1985',
    cpf: '987.654.321-09',
    gender: 'Feminino',
    phone: '(21) 98888-5678',
    memberSince: 'Fevereiro 2024',
    // Informações de endereço
    cep: '22071-900',
    street: 'Av. Atlântica',
    streetNumber: '1702',
    complement: '',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    state: 'RJ'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',                  // ✅ Email corrigido para teste
    password: '123456',                          // ✅ Senha simples para teste
    avatar: 'https://via.placeholder.com/150/dc3545/fff?text=CO',
    // Informações pessoais completas
    birthDate: '08/12/1992',
    cpf: '456.789.123-45',
    gender: 'Masculino',
    phone: '(31) 97777-9012',
    memberSince: 'Março 2024',
    // Informações de endereço
    cep: '30112-000',
    street: 'Rua da Bahia',
    streetNumber: '1148',
    complement: 'Sala 501',
    neighborhood: 'Centro',
    city: 'Belo Horizonte',
    state: 'MG'
  }
];

// Array de viagens simuladas para teste (por usuário)
const mockTravelPackages: { [userId: string]: TravelPackage[] } = {
  '1': [ // Viagens do João Silva
    {
      id: 'trip-1',
      title: 'Pacote Copacabana Premium',
      destination: 'Rio de Janeiro, RJ',
      startDate: '15/12/2023',
      endDate: '20/12/2023',
      duration: 5,
      price: 2800,
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
      description: 'Pacote completo com hotel 4 estrelas em Copacabana, café da manhã incluído e city tour.',
      includes: ['Hotel 4 estrelas', 'Café da manhã', 'City tour', 'Transfer aeroporto'],
      category: 'Praia',
      rating: 5,
      review: 'Viagem incrível! Hotel excelente e localização perfeita.'
    },
    {
      id: 'trip-2',
      title: 'Aventura em Campos do Jordão',
      destination: 'Campos do Jordão, SP',
      startDate: '05/07/2024',
      endDate: '09/07/2024',
      duration: 4,
      price: 1950,
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop',
      description: 'Pacote de inverno com pousada aconchegante, passeios pela cidade e gastronomia local.',
      includes: ['Pousada 3 estrelas', 'Café da manhã', 'Passeio de bondinho', 'Degustação de vinhos'],
      category: 'Montanha',
      rating: 4,
      review: 'Lugar lindo, clima perfeito para o inverno. Recomendo!'
    },
    {
      id: 'trip-3',
      title: 'Expedição Amazônica',
      destination: 'Manaus, AM',
      startDate: '10/10/2024',
      endDate: '16/10/2024',
      duration: 6,
      price: 3200,
      status: 'upcoming',
      imageUrl: 'https://images.unsplash.com/photo-1612201142533-887b4de4692d?w=400&h=300&fit=crop',
      description: 'Experiência única na floresta amazônica com lodge ecológico e passeios de barco.',
      includes: ['Lodge ecológico', 'Todas as refeições', 'Passeios de barco', 'Guia especializado'],
      category: 'Natureza'
    }
  ],
  '2': [ // Viagens da Maria Santos
    {
      id: 'trip-4',
      title: 'Relax em Búzios',
      destination: 'Búzios, RJ',
      startDate: '20/02/2024',
      endDate: '25/02/2024',
      duration: 5,
      price: 2400,
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      description: 'Pacote romântico em Búzios com pousada boutique e passeios de barco.',
      includes: ['Pousada boutique', 'Café da manhã', 'Passeio de barco', 'Jantar romântico'],
      category: 'Praia',
      rating: 5,
      review: 'Perfeito para relaxar! Búzios é um paraíso.'
    },
    {
      id: 'trip-5',
      title: 'Cultural Salvador',
      destination: 'Salvador, BA',
      startDate: '15/06/2024',
      endDate: '19/06/2024',
      duration: 4,
      price: 1800,
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop',
      description: 'Imersão cultural no Pelourinho com hotel histórico e shows folclóricos.',
      includes: ['Hotel histórico', 'Café da manhã', 'City tour', 'Show folclórico'],
      category: 'Cultural',
      rating: 4,
      review: 'Rica em cultura e história. Pelourinho é maravilhoso!'
    }
  ],
  '3': [ // Viagens do Carlos Oliveira
    {
      id: 'trip-6',
      title: 'Aventura em Bonito',
      destination: 'Bonito, MS',
      startDate: '12/09/2023',
      endDate: '17/09/2023',
      duration: 5,
      price: 2600,
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1596542047886-d013de5ce5eb?w=400&h=300&fit=crop',
      description: 'Ecoturismo em Bonito com flutuação, grutas e cachoeiras.',
      includes: ['Pousada ecológica', 'Pensão completa', 'Flutuação', 'Passeio grutas'],
      category: 'Ecoturismo',
      rating: 5,
      review: 'Experiência única! As águas cristalinas são impressionantes.'
    }
  ]
};

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
          memberSince: foundUser.memberSince,
          // Inclui informações de endereço
          cep: foundUser.cep,
          street: foundUser.street,
          streetNumber: foundUser.streetNumber,
          complement: foundUser.complement,
          neighborhood: foundUser.neighborhood,
          city: foundUser.city,
          state: foundUser.state
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
        memberSince: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }), // Data atual
        // Informações de endereço padrão (a serem preenchidas)
        cep: '00000-000',
        street: 'A definir',
        streetNumber: '0',
        complement: '',
        neighborhood: 'A definir',
        city: 'A definir',
        state: 'SP'
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
        memberSince: newUser.memberSince,
        // Informações de endereço padrão
        cep: newUser.cep,
        street: newUser.street,
        streetNumber: newUser.streetNumber,
        complement: newUser.complement || '',
        neighborhood: newUser.neighborhood,
        city: newUser.city,
        state: newUser.state
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
