import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { type TravelPackage } from './TravelCard';

interface TravelCarouselProps {
  travelPackages: TravelPackage[];
  onViewDetails?: (id: string) => void;
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

const TravelCarousel = ({ travelPackages }: TravelCarouselProps) => {
  return (
    <Carousel
      responsive={responsive}
      swipeable={true}
      draggable={true}
      showDots={true}
      infinite={false}
      keyBoardControl={true}
      containerClass="carousel-container"
      itemClass="px-3"
    >
      {travelPackages.map((pkg) => (
        <div
          key={pkg.id}
          className="border rounded p-3 d-flex flex-column align-items-center"
          style={{ height: '100%' }}
        >
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            style={{
              width: '100%',
              height: '180px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}
          />
          <h5>{pkg.title}</h5>
          <p className="text-muted" style={{ minHeight: '60px' }}>
            {pkg.description}
          </p>
          <h6 className="text-primary mb-3">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(pkg.price)}
          </h6>
        </div>
      ))}
    </Carousel>
  );
};

export default TravelCarousel;
