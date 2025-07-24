// Importações necessárias do React Bootstrap e React Router
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logotipo from '../../assets/logotipo.png'; // Importa a imagem do logotipo

// Componente Header - Cabeçalho da aplicação
const Header = () => {
  return (
    // Navbar com fundo azul personalizado, expansível em telas grandes
    <Navbar expand="lg" className="mb-0" style={{ backgroundColor: 'var(--primary-blue)' }}>
      <Container>
        {/* Logo da marca - clicável para voltar à página inicial */}
        <Navbar.Brand as={Link} to="/">
          <img 
            src={logotipo}                    // Caminho da imagem do logo
            alt="Próxima Parada"              // Texto alternativo para acessibilidade
            height="40"                       // Altura fixa do logo
            className="d-inline-block align-top" // Classes Bootstrap para alinhamento
          />
        </Navbar.Brand>
        
        {/* Botão hambúrguer para dispositivos móveis */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* Menu de navegação que se expande/contrai */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Links de navegação alinhados à direita */}
          <Nav className="ms-auto">
            {/* Link para a página inicial */}
            <Nav.Link as={Link} to="/" style={{ color: 'var(--white)' }}>Home</Nav.Link>
            {/* Link para a página de login */}
            <Nav.Link as={Link} to="/login" style={{ color: 'var(--white)' }}>Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
