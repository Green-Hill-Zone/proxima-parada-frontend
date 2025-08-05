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
          {/* Seção da Logo e Descrição */}
          <Col md={4} className="mb-4 mb-md-0">
            <img src={logo} alt="Próxima Parada" className="mb-3 footer-logo" />
            <p>
              Sua plataforma de confiança para descobrir e planejar as melhores viagens.
            </p>
          </Col>

          {/* Seção de Links Rápidos */}
          <Col md={4} className="mb-4 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-3">Links Rápidos</h6>
            <ul className="list-unstyled">
              <li><Link to="/packages">Pacotes</Link></li>
              <li><Link to="/flights">Voos</Link></li>
              <li><Link to="/hotels">Hotéis</Link></li>
            </ul>
          </Col>

          {/* Seção de Contato */}
          <Col md={4}>
            <h6 className="text-uppercase fw-bold mb-3">Contato</h6>
            <div className="contact-info">
              <p>contato@proximaparada.com</p>
              <p>+55 (11) 99999-9999</p>
              <p>Av. Central, 1234 - São Paulo/SP</p>
            </div>
          </Col>
        </Row>

        {/* Linha de separação e direitos autorais */}
        <hr className="footer-divider" />
        <Row className="pt-3">
          <Col className="text-center">
            <div className="footer-content">
              <p className="footer-text mb-0">
                &copy; 2025 Próxima Parada. Todos os direitos reservados.
                <span className="footer-separator">|</span>
                <a href="/politica-privacidade" className="footer-link">
                  Política de Privacidade
                </a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
