import { type TravelPackage } from '../../pages/Home/components';

export const mockTravelPackages: TravelPackage[] = [
  {
    id: '1',
    title: 'Paris Romântica',
    description: 'Descubra a cidade luz com este pacote completo de 7 dias incluindo hospedagem e passeios pelos principais pontos turísticos.',
    price: 3500,
    imageUrl: 'https://via.placeholder.com/300x200?text=Paris'
  },
  {
    id: '2',
    title: 'Tóquio Moderna',
    description: 'Explore a cultura japonesa e a modernidade de Tóquio em um pacote de 10 dias com guia especializado e experiências únicas.',
    price: 5200,
    imageUrl: 'https://via.placeholder.com/300x200?text=Tokyo'
  },
  {
    id: '3',
    title: 'Nova York Vibrante',
    description: 'A cidade que nunca dorme te espera! Pacote de 5 dias com ingressos para Broadway e principais atrações turísticas.',
    price: 4100,
    imageUrl: 'https://via.placeholder.com/300x200?text=New+York'
  }
];
