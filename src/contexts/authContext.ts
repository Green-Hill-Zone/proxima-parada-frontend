/* ===================================================================== */
/* DEFINIÇÃO DO CONTEXTO DE AUTENTICAÇÃO                               */
/* ===================================================================== */

import { createContext } from 'react';
import type { AuthContextType } from './types';

// Criação do contexto com valor padrão undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
