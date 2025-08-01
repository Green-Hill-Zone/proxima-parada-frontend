import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { type TravelPackageListItem } from '../../../../Entities/TravelPackage';
import TravelCard from './TravelCard';

interface TravelCarouselProps {
  travelPackages: TravelPackageListItem[];
  onViewDetails?: (id: number) => void;
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

const TravelCarousel: React.FC<TravelCarouselProps> = ({ travelPackages, onViewDetails }) => {
  return (
    <Carousel
      responsive={responsive}
      swipeable={true}
      draggable={true}
      showDots={true}
      infinite={false}
      keyBoardControl={true}
      containerClass="carousel-container"
      itemClass="px-3 py-2"
    >
      {travelPackages.map((travelPackage: any) => (
        <div key={travelPackage.id ?? travelPackage.Id} className="h-100">
          <TravelCard
            travelPackage={travelPackage}
            onViewDetails={onViewDetails}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default TravelCarousel;