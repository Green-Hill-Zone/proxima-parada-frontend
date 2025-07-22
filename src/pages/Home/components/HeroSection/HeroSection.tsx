import { Container, Row, Col } from 'react-bootstrap';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  return (
    <div className="bg-light py-5">
      <Container>
        <Row className="text-center">
          <Col>
            <h1 className="display-4 fw-bold text-primary">{title}</h1>
            <p className="lead">{subtitle}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
