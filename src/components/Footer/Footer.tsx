import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Próxima Parada</h5>
            <p>Sua agência de viagens de confiança</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>&copy; 2025 Próxima Parada. Todos os direitos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
