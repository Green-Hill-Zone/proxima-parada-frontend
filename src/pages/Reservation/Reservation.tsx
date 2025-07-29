import FlightInfo from '../Reservation/components/FlightSection/FlightInfo';
import HotelInfo from '../Reservation/components/HotelSection/HotelInfo';
import ReservationSummary from '../Reservation/components/Reservations/ReservationSummary';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const Reservation = () => {
  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Resumo da Viagem</h2>
        <div className="row align-items-stretch h-100">
          <div className="col-md-4 h-md-100">
            <FlightInfo />
          </div>
          <div className="col-md-4 h-md-100">
            <HotelInfo />
          </div>
          <div className="col-md-3 h-md-100">
            <ReservationSummary />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Reservation;
