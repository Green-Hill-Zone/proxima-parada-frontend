// Importações necessárias do React Bootstrap e React Router
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logotipo from '../../assets/logotipo.png'; // Importa a imagem do logotipo
import './Header.css'; // Importa os estilos específicos do Header

// Componente Header - Cabeçalho da aplicação
const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    // Navbar com fundo azul personalizado, expansível em telas grandes
    <Navbar expand="lg" className="header-navbar">
      <Container>
        {/* Logo da marca - clicável para voltar à página inicial */}
        <Navbar.Brand as={Link} to="/">
          <img 
            src={logotipo}                    // Caminho da imagem do logo
            alt="Próxima Parada"              // Texto alternativo para acessibilidade
            className="header-logo"           // Classe CSS personalizada
          />
        </Navbar.Brand>
        
        {/* Botão hambúrguer para dispositivos móveis */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="header-toggler" />
        
        {/* Menu de navegação que se expande/contrai */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Links de navegação alinhados à direita */}
          <Nav className="header-nav">
            {/* Link para a página inicial */}
            <Nav.Link as={Link} to="/" className="header-nav-link">Home</Nav.Link>
            
            {/* Mostra diferentes opções baseado no status de autenticação */}
            {user ? (
              // Menu dropdown para usuários logados
              <NavDropdown 
                title={`Olá, ${user.name}`} 
                id="user-dropdown"
                className="header-nav-link"
              >
                <NavDropdown.Item as={Link} to="/dashboard">
                  Minhas Viagens
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">
                  Perfil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Sair
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              // Link para login quando usuário não está logado
              <Nav.Link as={Link} to="/login" className="header-nav-link">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
