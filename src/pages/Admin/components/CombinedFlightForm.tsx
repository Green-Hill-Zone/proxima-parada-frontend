import React from "react";
import { Row, Col, Card } from 'react-bootstrap';

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
  handleFlightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFlightTypeChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const CombinedFlightForm: React.FC<Props> = ({ 
  flight, 
  flightType, 
  handleSubmit, 
  handleFlightChange, 
  handleFlightTypeChange 
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
                  <input 
                    type="text" 
                    className="form-control" 
                    name="companhia" 
                    value={flight.companhia} 
                    onChange={handleFlightChange} 
                    required 
                  />
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
                  <input 
                    type="text" 
                    className="form-control" 
                    name="origem" 
                    value={flight.origem} 
                    onChange={handleFlightChange} 
                    required 
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label">Destino</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="destino" 
                    value={flight.destino} 
                    onChange={handleFlightChange} 
                    required 
                  />
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
