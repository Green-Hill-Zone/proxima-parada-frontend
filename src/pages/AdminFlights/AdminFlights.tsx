import { useState } from 'react';
import { Button, Card, Col, Container, Modal, Row, Table } from 'react-bootstrap';
import { FaEdit, FaPlane, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import CombinedFlightForm from '../Admin/components/CombinedFlightForm';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  isActive: boolean;
}

const AdminFlights = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.ADMIN_FLIGHTS);
  
  const navigate = useNavigate();
  const [flights] = useState<Flight[]>([
    {
      id: '1',
      airline: 'LATAM',
      flightNumber: 'LA3721',
      origin: 'São Paulo (GRU)',
      destination: 'Cancún (CUN)',
      departureTime: '14:30',
      arrivalTime: '20:15',
      price: 1890.00,
      isActive: true
    },
    {
      id: '2',
      airline: 'Gol',
      flightNumber: 'G31045',
      origin: 'Rio de Janeiro (GIG)',
      destination: 'Buenos Aires (EZE)',
      departureTime: '08:45',
      arrivalTime: '12:30',
      price: 950.00,
      isActive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [flight, setFlight] = useState({
    companhia: '',
    numero: '',
    origem: '',
    destino: '',
    data: '',
    horario: ''
  });
  const [flightType, setFlightType] = useState({
    nome: '',
    descricao: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Voo cadastrado:', { flight, flightType });
    setShowModal(false);
    // Reset forms
    setFlight({
      companhia: '',
      numero: '',
      origem: '',
      destino: '',
      data: '',
      horario: ''
    });
    setFlightType({
      nome: '',
      descricao: ''
    });
  };

  const handleFlightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFlight(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFlightTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFlightType(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="admin-flights-main" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container>
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-3">
                <h1><FaPlane className="me-2" />Gerenciar Voos</h1>
                <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
                  ← Dashboard
                </Button>
              </div>
              <Button variant="primary" onClick={() => navigate('/admin/flights/register')}>
                <FaPlus className="me-2" />
                Novo Voo
              </Button>
            </div>

            <Card>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Companhia</th>
                      <th>Voo</th>
                      <th>Origem</th>
                      <th>Destino</th>
                      <th>Partida</th>
                      <th>Chegada</th>
                      <th>Preço</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((flight) => (
                      <tr key={flight.id}>
                        <td>{flight.airline}</td>
                        <td><strong>{flight.flightNumber}</strong></td>
                        <td>{flight.origin}</td>
                        <td>{flight.destination}</td>
                        <td>{flight.departureTime}</td>
                        <td>{flight.arrivalTime}</td>
                        <td>R$ {flight.price.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${flight.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {flight.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <FaEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal para criar/editar voo */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Cadastrar Novo Voo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CombinedFlightForm 
              flight={flight}
              flightType={flightType}
              handleSubmit={handleSubmit}
              handleFlightChange={handleFlightChange}
              handleFlightTypeChange={handleFlightTypeChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Salvar Voo
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  );
};

export default AdminFlights;
