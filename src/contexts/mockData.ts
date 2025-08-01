/* ===================================================================== */
/* DADOS SIMULADOS - BANCO DE DADOS MOCK                               */
/* ===================================================================== */

import type { TravelPackage } from './types';

// Array de usuários simulados para teste (substitui API/banco real)
export const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',                    // ✅ Email corrigido para teste
    password: '123456',                          // ✅ Senha simples para teste
    role: 'user',                               // Role padrão
    avatar: 'https://via.placeholder.com/150/007bff/fff?text=JS',
    // Informações pessoais completas
    birthDate: '15/03/1990',
    cpf: '123.456.789-01',
    gender: 'Masculino',
    phone: '(11) 99999-1234',
    phone2: '(11) 99999-1235',
    memberSince: 'Janeiro 2024',
    // Informações de endereço
    cep: '01310-100',
    street: 'Av. Paulista',
    streetNumber: '1578',
    complement: 'Apto 142',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',                   // ✅ Email corrigido para teste
    password: '123456',                          // ✅ Senha simples para teste
    role: 'user',                               // Role padrão
    avatar: 'https://via.placeholder.com/150/28a745/fff?text=MS',
    // Informações pessoais completas
    birthDate: '22/07/1985',
    cpf: '987.654.321-09',
    gender: 'Feminino',
    phone: '(21) 98888-5678',
    phone2: '(21) 98888-5679',
    memberSince: 'Fevereiro 2024',
    // Informações de endereço
    cep: '22071-900',
    street: 'Av. Atlântica',
    streetNumber: '1702',
    complement: '',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',                  // ✅ Email corrigido para teste
    password: '123456',                          // ✅ Senha simples para teste
    role: 'user',                               // Role padrão
    avatar: 'https://via.placeholder.com/150/dc3545/fff?text=CO',
    // Informações pessoais completas
    birthDate: '08/12/1992',
    cpf: '456.789.123-45',
    gender: 'Masculino',
    phone: '(31) 97777-9012',
    phone2: '(31) 97777-9013',
    memberSince: 'Março 2024',
    // Informações de endereço
    cep: '30112-000',
    street: 'Rua da Bahia',
    streetNumber: '1148',
    complement: 'Sala 501',
    neighborhood: 'Centro',
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'Brasil'
  },
  {
    id: 'admin1',
    name: 'Admin Sistema',
    email: 'admin@email.com',                   // ✅ Email para teste de admin
    password: '123456',                          // ✅ Senha simples para teste
    role: 'admin',                               // Role de administrador
    avatar: 'https://via.placeholder.com/150/6f42c1/fff?text=AD',
    // Informações pessoais completas
    birthDate: '01/01/1980',
    cpf: '000.000.000-00',
    gender: 'Masculino',
    phone: '(11) 99999-0000',
    phone2: '',
    memberSince: 'Janeiro 2023',
    // Informações de endereço
    cep: '01310-100',
    street: 'Av. Paulista',
    streetNumber: '1000',
    complement: 'Andar Admin',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil'
  }
];

// Array de viagens simuladas para teste (por usuário)
export const mockTravelPackages: { [userId: string]: TravelPackage[] } = {
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
    },
    {
      id: 'trip-7',
      title: 'Paris - França',
      destination: 'Paris, França',
      startDate: '15/08/2025',
      endDate: '22/08/2025',
      duration: 7,
      price: 3500,
      status: 'upcoming',
      imageUrl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop',
      description: 'Viagem romântica para Paris com hotel 4 estrelas, passeios pelos pontos turísticos e experiência gastronômica única.',
      includes: ['Hotel 4 estrelas', 'Café da manhã', 'City tour', 'Visita Torre Eiffel', 'Passeio no Sena'],
      category: 'Cultural',
      rating: undefined,
      review: undefined
    },
    {
      id: 'trip-8',
      title: 'Londres - Inglaterra',
      destination: 'Londres, Inglaterra',
      startDate: '10/09/2025',
      endDate: '17/09/2025',
      duration: 7,
      price: 4200,
      status: 'cancelled',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
      description: 'Descobrindo Londres com visitas aos principais pontos turísticos, museus e experiência cultural britânica.',
      includes: ['Hotel 3 estrelas', 'Café da manhã', 'City tour', 'Museus', 'Thames cruise'],
      category: 'Cultural',
      rating: undefined,
      review: undefined
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
