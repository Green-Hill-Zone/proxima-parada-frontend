import { useEffect } from 'react';

/**
 * Hook customizado para definir o título da página dinamicamente
 * @param title - O título específico da página
 * @param baseName - O nome base da aplicação (opcional)
 */
export const usePageTitle = (title: string, baseName: string = 'Próxima Parada') => {
  useEffect(() => {
    // Define o título completo da página
    const fullTitle = title ? `${title} - ${baseName}` : baseName;
    document.title = fullTitle;

    // Cleanup: retorna ao título padrão quando o componente é desmontado
    return () => {
      document.title = baseName;
    };
  }, [title, baseName]);
};

/**
 * Títulos padrão para as páginas da aplicação
 */
export const PAGE_TITLES = {
  // Páginas públicas
  HOME: 'Sua Agência de Viagens',
  LOGIN: 'Entrar',
  REGISTER: 'Cadastrar-se',
  PACKAGES: 'Pacotes de Viagem',
  FLIGHTS: 'Voos',
  HOTELS: 'Hotéis',
  RESERVATION: 'Reserva',
  PAYMENT: 'Pagamento',
  
  // Páginas do usuário
  DASHBOARD: 'Painel do Usuário',
  PROFILE: 'Meu Perfil',
  MY_TRAVELS: 'Minhas Viagens',
  MY_PAYMENTS: 'Meus Pagamentos',
  
  // Páginas administrativas
  ADMIN_DASHBOARD: 'Painel Administrativo',
  ADMIN_PACKAGES: 'Gerenciar Pacotes',
  ADMIN_HOTELS: 'Gerenciar Hotéis',
  ADMIN_FLIGHTS: 'Gerenciar Voos',
  ADMIN_SALES: 'Relatórios de Vendas',
  ADMIN_REGISTER: 'Cadastro de Administrador',
  ADMIN_HOTEL_REGISTER: 'Cadastrar Hotel',
  ADMIN_FLIGHT_REGISTER: 'Cadastrar Voo',
  ADMIN_PACKAGE_REGISTER: 'Cadastrar Pacote',
} as const;
