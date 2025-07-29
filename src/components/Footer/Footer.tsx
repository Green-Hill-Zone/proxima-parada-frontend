// Importação dos componentes do React Bootstrap
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../imgs/logo/logo.svg';

import './Footer.css'; // Importa os estilos específicos do Footer

// Componente Footer - Rodapé da aplicação
const Footer = () => {
  return (
    // Rodapé com classes CSS personalizadas
    <footer className="footer-container">
      <Container>
        <Row className="mb-4">
          <Col md={4}>
            <img src={logo} alt="Logo" />
            <p>Sua agência de viagens de confiança.</p>
          </Col>

          <Col md={4}>
            <h6 className="text-uppercase fw-bold">Links Rápidos</h6>
            <ul className="list-unstyled">
              <li><Link to="/hospedagem" className="text-light text-decoration-none">Hospedagem</Link></li>
              <li><Link to="/passagens" className="text-light text-decoration-none">Passagens</Link></li>
              <li><Link to="/aluguel" className="text-light text-decoration-none">Aluguel de carros</Link></li>
              <li><Link to="/passeios" className="text-light text-decoration-none">Passeios e atividades</Link></li>
            </ul>
          </Col>

          <Col md={4}>
            <h6 className="text-uppercase fw-bold">Contato</h6>
            <p className="mb-1">contato@proximaparada.com</p>
            <p className="mb-1">+55 (11) 99999-9999</p>
            <p>Av. Central, 1234 - São Paulo/SP</p>
          </Col>
        </Row>

        <Row>
          <Col className="text-center">
            <hr className="border-light" />
            {/* Row centralizada com conteúdo alinhado ao centro */}
            <Row className="footer-content">
              <Col>
                {/* Parágrafo com informações de direitos autorais e link */}
                <p className="footer-text">
                  {/* Texto de direitos reservados */}
                  &copy; 2025 Próxima Parada. Todos os direitos reservados.
                  {/* Separador visual entre o texto e o link */}
                  <span className="footer-separator">|</span>
                  {/* Link para política de privacidade com estilo personalizado */}
                  <a
                    href="/politica-privacidade"  // URL da página de política de privacidade
                    className="footer-link"        // Classe CSS personalizada (laranja com hover branco)
                  >
                    Política de Privacidade
                  </a>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
