import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/header/header.css';
import logo from '../../imgs/logo/logo.svg';
import iconHosp from '../../imgs/icons-menu/icon-hosp.svg';
import iconAviao from '../../imgs/icons-menu/icon-aviao.svg';
import iconCar from '../../imgs/icons-menu/icon-car.svg';
import iconPasseio from '../../imgs/icons-menu/icon-passeio.svg';


const Header = () => {
  return (
    <Navbar className="custom-navbar mb-0" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
};

export default Header;
