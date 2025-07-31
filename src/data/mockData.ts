import { type TravelPackage } from '../pages/Home/components';
import parisImage from '../imgs/img-travelCard/img-paris.png';
import toquioImage from '../imgs/img-travelCard/img-toquio.png';
import novaIorqueImage from '../imgs/img-travelCard/img-novaIorque.png';
import zuriqueImage from '../imgs/img-travelCard/img-zurique.png';
import madriImage from '../imgs/img-travelCard/img-madri.png';
import orlandoImage from '../imgs/img-travelCard/img-orlando.png';

export const mockTravelPackages: TravelPackage[] = [
  {
    id: '1',
    title: 'Paris Romântica',
    description:
      'Viva dias inesquecíveis na cidade do amor! Um pacote de 7 dias com hospedagem charmosa e passeios pelos pontos mais icônicos de Paris.',
    price: 3500,
    imageUrl: parisImage
  },
  {
    id: '2',
    title: 'Tóquio Moderna',
    description:
      'Mergulhe na tecnologia e tradição do Japão com este pacote de 10 dias em Tóquio. Inclui guia local, templos, gastronomia e experiências únicas.',
    price: 5200,
    imageUrl: toquioImage
  },
  {
    id: '3',
    title: 'Nova York Vibrante',
    description:
      'Conheça a cidade que nunca dorme! Pacote de 5 dias com hospedagem central, ingressos para a Broadway e visitas aos principais pontos turísticos.',
    price: 4100,
    imageUrl: novaIorqueImage
  },
  {
    id: '4',
    title: 'Zurique Elegante',
    description:
      'Explore a sofisticação suíça com 6 dias em Zurique. Desfrute de passeios pelos Alpes, chocolates artesanais e museus renomados.',
    price: 4600,
    imageUrl: zuriqueImage
  },
  {
    id: '5',
    title: 'Madri Cultural',
    description:
      'Descubra a capital espanhola em 7 dias cheios de arte, tapas e história. Inclui city tour, museus e uma verdadeira imersão na cultura local.',
    price: 3900,
    imageUrl: madriImage
  },
  {
    id: '6',
    title: 'Orlando Diversão em Família',
    description:
      'Diversão garantida para todas as idades! Pacote de 8 dias com entradas para os principais parques temáticos, traslados e hotel confortável.',
    price: 5800,
    imageUrl: orlandoImage
  }
];
