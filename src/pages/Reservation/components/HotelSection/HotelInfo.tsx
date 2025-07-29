import { useState } from "react";
import { Card, Badge } from "react-bootstrap";
import { useReservation } from "../../context/ReservationContext";
import { FaHotel, FaCoffee } from "react-icons/fa";

const HotelInfo = () => {
  const { reservation } = useReservation();
  const hotel = reservation.hotel;
  const [selectedSuite, setSelectedSuite] = useState("master");

  return (
    <Card className="rounded-4 mb-0 stat-card">
      <Card.Header
        className="rounded-top-4 d-flex justify-content-between align-items-center border-0"
        style={{ background: "#3246aa" }}
      >
        <header aria-level={2} className="d-flex gap-2 align-items-center">
          <FaHotel className="text-white" />
          <span className="d-block fw-bold text-white">Hotel</span>
        </header>
        <nav className="d-flex align-items-center gap-2">
          <a href="#" className="text-decoration-none fw-bold inline-block text-white">
            Detalhes do hotel
          </a>
        </nav>
      </Card.Header>
      <Card.Body className="p-2 bg-white rounded-4">
        <div className="row w-100">
          <div className="col-auto">
            <img
              src="https://placehold.co/600x400"
              alt="Foto do hotel"
              className="rounded-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
          <div className="col">
            <h5 className="fw-bold mb-1">{hotel.name}</h5>
            <div className="text-muted small mb-2">
              {hotel.address} ·{" "}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  hotel.address
                )}`}
                className="fw-semibold text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                Veja no mapa
              </a>
            </div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-warning">★ ★ ★ ☆ ☆</span>
              <span className="text-secondary small">+15</span>
            </div>
            <div className="d-flex justify-content-between text-center mb-3">
              <div>
                <div className="fw-bold text-uppercase text-primary">
                  jul 28
                </div>
                <div className="text-muted small">Entrada na segunda-feira</div>
              </div>
              <div>
                <div className="fw-bold text-uppercase text-primary">
                  jul 31
                </div>
                <div className="text-muted small">Saída na quinta-feira</div>
              </div>
            </div>

          </div>
        </div>
        <Card
          className="p-1 border rounded-3 mb-2 w-100"
          style={{ boxShadow: 'none', transition: 'none', transform: 'none' }}
          onMouseOver={e => {
            e.currentTarget.style.setProperty('box-shadow', 'none', 'important');
            e.currentTarget.style.setProperty('transform', 'none', 'important');
            e.currentTarget.style.setProperty('transition', 'none', 'important');
          }}
          onMouseOut={e => {
            e.currentTarget.style.setProperty('box-shadow', 'none', 'important');
            e.currentTarget.style.setProperty('transform', 'none', 'important');
            e.currentTarget.style.setProperty('transition', 'none', 'important');
          }}
        >
          <div className="fw-bold mb-2">Escolha a suíte:</div>
          <select
            className="form-select w-100 mb-2"
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value)}
          >
            <option value="master">Master</option>
            <option value="simples">Simples</option>
            <option value="premium">Premium</option>
          </select>
          <div className="mb-2 d-flex flex-wrap align-items-center gap-2">
            {selectedSuite === "master" && (
              <Badge bg="light" text="dark">
                Cama king size, banheira, vista para o mar, 40m²
              </Badge>
            )}
            {selectedSuite === "simples" && (
              <Badge bg="light" text="dark">
                Cama de casal, banheiro privativo, 20m²
              </Badge>
            )}
            {selectedSuite === "premium" && (
              <Badge bg="light" text="dark">
                Cama king size, hidromassagem, varanda, 60m²
              </Badge>
            )}
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <Badge bg="light" text="dark">
              <FaCoffee className="me-1 text-danger" />
              Café da Manhã
            </Badge>
          </div>
        </Card>
        <div className="mt-2">
              <Badge bg="success" text="white">
                Reembolsável
              </Badge>
            </div>
      </Card.Body>
    </Card>
  );
};

export default HotelInfo;
