import React from "react";
import { Card, Col, Row } from 'react-bootstrap';
import type { Airline } from "../../../services/AirlineService";
import type { Destination } from "../../../services/DestinationService";

type FlightData = {
  companhia: string;
  numero: string;
  origem: string;
  destino: string;
  data: string;
  horario: string;
};

type FlightTypeData = {
  nome: string;
  descricao: string;
};

type Props = {
  flight: FlightData;
  flightType: FlightTypeData;
  handleSubmit: (e: React.FormEvent) => void;
  handleFlightChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFlightTypeChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  airlines?: Airline[];
  destinations?: Destination[];
  isLoadingAirlines?: boolean;
  isLoadingDestinations?: boolean;
};

const CombinedFlightForm: React.FC<Props> = ({
  flight,
  flightType,
  handleSubmit,
  handleFlightChange,
  handleFlightTypeChange,
  airlines = [],
  destinations = [],
  isLoadingAirlines = false,
  isLoadingDestinations = false
}) => (
  <form onSubmit={handleSubmit}>
    <Row>
      {/* Informações do Voo */}
      <Col md={8}>
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Informações do Voo</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label">Companhia Aérea</label>
                  {isLoadingAirlines ? (
                    <div className="d-flex align-items-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span>Carregando companhias...</span>
                    </div>
                  ) : (
                    <select
                      className="form-select"
                      name="companhia"
                      value={flight.companhia}
                      onChange={handleFlightChange}
                      required
                    >
                      <option value="">Selecione uma companhia</option>
                      {airlines && airlines.map(airline => (
                        <option key={airline.id} value={airline.id}>
                          {airline.name} ({airline.code})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label">Número do Voo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="numero"
                    value={flight.numero}
                    onChange={handleFlightChange}
                    required
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label">Origem</label>
                  {isLoadingDestinations ? (
                    <div className="d-flex align-items-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span>Carregando origens...</span>
                    </div>
                  ) : (
                    <select
                      className="form-select"
                      name="origem"
                      value={flight.origem}
                      onChange={handleFlightChange}
                      required
                    >
                      <option value="">Selecione a origem</option>
                      {destinations && destinations.map(destination => (
                        <option key={destination.id} value={destination.id}>
                          {destination.name} - {destination.city}, {destination.country}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label">Destino</label>
                  {isLoadingDestinations ? (
                    <div className="d-flex align-items-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span>Carregando destinos...</span>
                    </div>
                  ) : (
                    <select
                      className="form-select"
                      name="destino"
                      value={flight.destino}
                      onChange={handleFlightChange}
                      required
                    >
                      <option value="">Selecione o destino</option>
                      {destinations && destinations.map(destination => (
                        <option key={destination.id} value={destination.id}>
                          {destination.name} - {destination.city}, {destination.country}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label">Data</label>
                  <input
                    type="date"
                    className="form-control"
                    name="data"
                    value={flight.data}
                    onChange={handleFlightChange}
                    required
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label">Horário</label>
                  <input
                    type="time"
                    className="form-control"
                    name="horario"
                    value={flight.horario}
                    onChange={handleFlightChange}
                    required
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      {/* Tipo de Voo */}
      <Col md={4}>
        <Card className="mb-3">
          <Card.Header>
            <h5 className="mb-0">Tipo de Voo</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <label className="form-label">Nome do Tipo</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={flightType.nome}
                onChange={handleFlightTypeChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-control"
                name="descricao"
                value={flightType.descricao}
                onChange={handleFlightTypeChange}
                rows={4}
                required
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </form>
);

export default CombinedFlightForm;
