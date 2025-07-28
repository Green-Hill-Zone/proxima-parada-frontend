// Importações necessárias do React Bootstrap e React Router
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/header/header.css';
import logo from '../../imgs/logo/logo.svg';
import iconHosp from '../../imgs/icons-menu/icon-hosp.svg';
import iconAviao from '../../imgs/icons-menu/icon-aviao.svg';
import iconCar from '../../imgs/icons-menu/icon-car.svg';
import iconPasseio from '../../imgs/icons-menu/icon-passeio.svg';

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
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/hospedagem">
              <img src={iconHosp} alt="" className="menu-icon" /> Hospedagem
            </Nav.Link>
            <Nav.Link as={Link} to="/passagens">
              <img src={iconAviao} alt="" className="menu-icon" /> Passagens
            </Nav.Link>
            <Nav.Link as={Link} to="/aluguel">
              <img src={iconCar} alt="" className="menu-icon" /> Aluguel de carros
            </Nav.Link>
            <Nav.Link as={Link} to="/passeios">
              <img src={iconPasseio} alt="" className="menu-icon" /> Passeios e atividades
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cadastro">Cadastre-se</Nav.Link>
            <Nav.Link as={Link} to="/login" className="btn btn-warning rounded-pill btn-login">Login</Nav.Link>
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
};

export default Header;
