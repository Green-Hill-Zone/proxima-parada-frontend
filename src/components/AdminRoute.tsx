import { type ReactNode } from 'react';
import { Alert, Container } from 'react-bootstrap';
import { useAuth, useIsAdmin } from '../hooks/useAuth';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading } = useAuth();
  const isAdmin = useIsAdmin();

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          <h4>Acesso Restrito</h4>
          <p>Você precisa estar logado para acessar esta página.</p>
        </Alert>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Acesso Negado</h4>
          <p>Você não tem permissão para acessar esta área administrativa.</p>
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
