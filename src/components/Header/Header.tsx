// Importações necessárias do React Bootstrap e React Router
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../imgs/logo/logo.svg';
import { FaBox, FaPlane, FaHotel, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import '../../styles/header/header.css';

import { useAuth, useIsAdmin } from '../../hooks/useAuth';
import './Header.css'; // Importa os estilos específicos do Header

// Componente Header - Cabeçalho da aplicação
const Header = () => {
  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();

  const handleLogout = () => {
    logout();
  };

  return (
    // Navbar com fundo azul personalizado, expansível em telas grandes
    <Navbar expand="lg" className="header-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" />
        </Navbar.Brand>
        {/* Menu de navegação que se expande/contrai */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Packages" className="header-nav-link">
              <FaBox className="menu-icon" style={{ fontSize: '0.95em' }} /> Pacotes
            </Nav.Link>
            <Nav.Link as={Link} to="/Flights" className="header-nav-link">
              <FaPlane className="menu-icon" style={{ fontSize: '0.95em' }} /> Voos
            </Nav.Link>
            <Nav.Link as={Link} to="/Hotels" className="header-nav-link">
              <FaHotel className="menu-icon" style={{ fontSize: '0.95em' }} /> Hotéis
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {/* Links de navegação alinhados à direita */}
            <Nav className="header-nav">

              {/* Mostra diferentes opções baseado no status de autenticação */}
              {user ? (
                // Menu dropdown para usuários logados
                <NavDropdown
                  title={`Olá, ${user.name}`}
                  id="user-dropdown"
                  className="header-nav-link"
                >
                  {isAdmin ? (
                    // Menu para administradores
                    <>
                      <NavDropdown.Item as={Link} to="/admin/dashboard">
                        Dashboard Admin
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/hotels">
                        Gerenciar Hotéis
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/flights">
                        Gerenciar Voos
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/packages">
                        Gerenciar Pacotes
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/sales">
                        Relatórios de Vendas
                      </NavDropdown.Item>
                    </>
                  ) : (
                    // Menu para clientes
                    <>
                      <NavDropdown.Item as={Link} to="/dashboard">
                        Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/my-travels">
                        Minhas Viagens
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/my-payments">
                        Meus Pagamentos
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/profile">
                        Perfil
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                // Link para login quando usuário não está logado
                <div className="d-flex flex-row mb-3">
                  <Nav.Link as={Link} to="/register" className="header-nav-link">
                    <FaUserPlus className="menu-icon" style={{ fontSize: '0.95em' }} /> Cadastre-se
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login" className="header-nav-link">
                    <FaSignInAlt className="menu-icon" style={{ fontSize: '0.95em' }} /> Login
                  </Nav.Link>

                </div>
              )}
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
};

export default Header;
