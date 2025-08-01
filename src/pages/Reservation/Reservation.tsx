import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import type { TravelPackageDetailResponse } from '../../Entities/TravelPackage';
import { getTravelPackageById } from '../../services/TravelPackageService';
import FlightInfo from './components/FlightSection/FlightInfo';
import HotelInfo from './components/HotelSection/HotelInfo';
import ReservationSummary from './components/Reservations/ReservationSummary';

const Reservation = () => {
  const { id } = useParams<{ id: string }>();
  const [travelPackage, setTravelPackage] = useState<TravelPackageDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTravelPackage = async () => {
      try {
        setLoading(true);

        if (!id) {
          throw new Error('ID do pacote não fornecido');
        }

        const packageId = parseInt(id, 10);
        if (isNaN(packageId)) {
          throw new Error('ID do pacote inválido');
        }

        const packageData = await getTravelPackageById(packageId);

        if (!packageData) {
          throw new Error('Pacote não encontrado');
        }

        setTravelPackage(packageData);
      } catch (err) {
        console.error('Erro ao carregar detalhes do pacote:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do pacote');
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-2">Carregando detalhes da reserva...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">
          <Alert.Heading>Erro ao carregar reserva</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  if (!travelPackage) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">
          <Alert.Heading>Pacote não encontrado</Alert.Heading>
          <p>Não foi possível encontrar os detalhes do pacote solicitado.</p>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-5">
        <h2 className="mb-4 text-center">{travelPackage.Title} - Resumo da Viagem</h2>
        <div className="row align-items-stretch h-100">
          <div className="col-md-4 h-md-100 py-3">
            <FlightInfo OutboundFlight={travelPackage.Flights[0]} ReturnFlight={travelPackage.Flights[1]} />
          </div>
          <div className="col-md-4 h-md-100 py-3">
            <HotelInfo accommodations={travelPackage.Accommodations} />
          </div>
          <div className="col-md-3 h-md-100 py-3">
            <ReservationSummary
              packageDetails={travelPackage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Reservation;