// Importação dos componentes do React Bootstrap
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; // Importa os estilos específicos do Footer

// Componente Footer - Rodapé da aplicação
const Footer = () => {
  return (
    // Rodapé com classes CSS personalizadas
    <footer className="footer-container">
      <Container>
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
      </Container>
    </footer>
  );
};

export default Footer;
