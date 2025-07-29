// Importações necessárias
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Interface para as props do componente
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Componente ProtectedRoute - Protege rotas que precisam de autenticação
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Enquanto está carregando, pode mostrar um spinner ou nada
  if (isLoading) {
    return null; // ou um componente de loading
  }

  // Se não há usuário logado, redireciona para login
  // Salva a localização atual para redirecionar após login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se está autenticado, renderiza os children
  return <>{children}</>;
};

export default ProtectedRoute;
