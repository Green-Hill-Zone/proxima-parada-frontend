// Importação dos componentes do React Bootstrap
import { Container, Row, Col } from 'react-bootstrap';

// Componente Footer - Rodapé da aplicação
const Footer = () => {
  return (
    // Rodapé com fundo azul, texto branco, padding reduzido e margem automática no topo
    <footer className="text-light py-2 mt-auto" style={{ backgroundColor: 'var(--primary-blue)', fontSize: '0.9rem' }}>
      <Container>
        {/* Row centralizada com conteúdo alinhado ao centro */}
        <Row className="justify-content-center text-center">
          <Col>
            {/* Parágrafo com informações de direitos autorais e link */}
            <p className="mb-0">
              {/* Texto de direitos reservados */}
              &copy; 2025 Próxima Parada. Todos os direitos reservados.
              {/* Separador visual entre o texto e o link */}
              <span className="mx-2">|</span>
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
