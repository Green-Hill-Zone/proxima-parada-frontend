/* ===================================================================== */
/* HOOKS PERSONALIZADOS PARA AUTENTICAÇÃO                               */
/* ===================================================================== */
/*
 * Este arquivo contém hooks customizados que facilitam o acesso
 * ao contexto de autenticação em qualquer componente da aplicação.
 * 
 * Vantagens dos hooks:
 * - Simplifica o uso do contexto
 * - Adiciona validação de uso correto
 * - Fornece interface mais limpa para componentes
 */

// Importações necessárias
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../contexts/AuthContext';

/* ===================================================================== */
/* HOOK PRINCIPAL DE AUTENTICAÇÃO                                       */
/* ===================================================================== */

/**
 * Hook customizado para acessar o contexto de autenticação
 * 
 * Como usar:
 * const { user, login, logout, isLoading } = useAuth();
 * 
 * @returns {AuthContextType} Objeto com estado e funções de autenticação
 * @throws {Error} Se usado fora do AuthProvider
 */
export const useAuth = (): AuthContextType => {
  // Obtém o contexto de autenticação
  const context = useContext(AuthContext);
  
  // Validação: verifica se o hook está sendo usado dentro do Provider
  if (context === undefined) {
    throw new Error(
      'useAuth deve ser usado dentro de um AuthProvider. ' +
      'Certifique-se de que o componente está envolvido pelo <AuthProvider>'
    );
  }
  
  // Retorna o contexto completo
  return context;
};

/* ===================================================================== */
/* HOOK PARA VERIFICAÇÃO DE AUTENTICAÇÃO                               */
/* ===================================================================== */

/**
 * Hook específico para verificar se o usuário está autenticado
 * 
 * Como usar:
 * const { isAuthenticated, user, isLoading } = useRequireAuth();
 * 
 * @returns {Object} Objeto com informações de autenticação
 * - user: dados do usuário logado (ou null)
 * - isLoading: se está carregando dados
 * - isAuthenticated: boolean indicando se está logado
 */
export const useRequireAuth = () => {
  const { user, isLoading } = useAuth();
  
  return { 
    user,                           // Dados do usuário atual
    isLoading,                      // Estado de carregamento
    isAuthenticated: !!user         // true se user existe, false caso contrário
  };
};
