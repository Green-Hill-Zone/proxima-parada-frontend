import { Container } from 'react-bootstrap';

interface HeroSectionProps {
  imgSrc: string;
  title: string;
  subtitle: string;
}

const HeroSection = ({ imgSrc, title, subtitle }: HeroSectionProps) => {
  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${imgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div className="hero-overlay">
        <Container>
          <h1 style={{ whiteSpace: 'pre-line' }} className="display-4 fw-bold text-light">{title}</h1>
          <p className="lead text-light">{subtitle}</p>
        </Container>
      </div>
    </div>
  );
};

export default HeroSection;
