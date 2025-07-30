// Importações necessárias do React Bootstrap e React Router
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import iconAviao from '../../imgs/icons-menu/icon-aviao.svg';
import iconCar from '../../imgs/icons-menu/icon-car.svg';
import iconHosp from '../../imgs/icons-menu/icon-hosp.svg';
import iconPasseio from '../../imgs/icons-menu/icon-passeio.svg';
import logo from '../../imgs/logo/logo.svg';
import '../../styles/header/header.css';

import { useAuth } from '../../hooks/useAuth';
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
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />


        {/* Botão hambúrguer para dispositivos móveis */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="header-toggler" />

        {/* Menu de navegação que se expande/contrai */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/hospedagem" className="header-nav-link">
              <img src={iconHosp} alt="" className="menu-icon" /> Pacotes
            </Nav.Link>
            <Nav.Link as={Link} to="/passagens" className="header-nav-link">
              <img src={iconAviao} alt="" className="menu-icon" /> Passagens
            </Nav.Link>
            <Nav.Link as={Link} to="/aluguel" className="header-nav-link">
              <img src={iconCar} alt="" className="menu-icon" /> Aluguel de carros
            </Nav.Link>
            <Nav.Link as={Link} to="/passeios" className="header-nav-link">
              <img src={iconPasseio} alt="" className="menu-icon" /> Passeios e atividades
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
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                // Link para login quando usuário não está logado
                <div className="d-flex flex-row mb-3">
                  <Nav.Link as={Link} to="/register" className="header-nav-link">Cadastre-se</Nav.Link>
                  <Nav.Link as={Link} to="/login" className="header-nav-link">Login</Nav.Link>

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
