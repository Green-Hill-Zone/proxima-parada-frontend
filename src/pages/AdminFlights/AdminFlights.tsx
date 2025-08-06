import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import { FaPlane, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FixedColumnsTable from '../../components/FixedColumnsTable/FixedColumnsTable';
import type { Flight } from '../../services/FlightService';
import { deleteFlight, getAllFlights } from '../../services/FlightService';
import CombinedFlightForm from '../Admin/components/CombinedFlightForm';

const AdminFlights = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar voos do backend
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);

      try {
        const flightsData = await getAllFlights();
        console.log('Voos carregados:', flightsData);
        setFlights(flightsData);
      } catch (err) {
        console.error('Erro ao carregar voos:', err);
        setError('Não foi possível carregar os voos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  // Função para lidar com a exclusão de voo
  const handleDeleteFlight = (id: number) => {
    setSelectedFlightId(id);
    setShowDeleteModal(true);
  };

  // Confirmar exclusão de voo
  const confirmDeleteFlight = async () => {
    if (!selectedFlightId) return;

    setDeleteLoading(true);
    try {
      const success = await deleteFlight(selectedFlightId);
      if (success) {
        // Remover voo da lista local para atualização imediata da UI
        setFlights(flights.filter(flight => flight.id !== selectedFlightId));
        setShowDeleteModal(false);
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao excluir voo:', err);
      setError('Falha ao excluir o voo. Tente novamente.');
    } finally {
      setDeleteLoading(false);
      setSelectedFlightId(null);
    }
  };

  // Função para lidar com o envio do formulário
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

  // Função para lidar com mudanças nos campos do formulário
  const handleFlightChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlight(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para lidar com mudanças nos campos de tipo de voo
  const handleFlightTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFlightType(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="admin-flights-main" style={{ backgroundColor: 'var(--background-color)', paddingTop: '2rem' }}>
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
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center p-5">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Carregando voos...</span>
                  </div>
                ) : error ? (
                  <Alert variant="danger">
                    <Alert.Heading>Erro ao carregar dados</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => window.location.reload()}>
                      Tentar novamente
                    </Button>
                  </Alert>
                ) : flights.length === 0 ? (
                  <div className="text-center p-5">
                    <p className="mb-3">Nenhum voo encontrado</p>
                    <Button variant="primary" onClick={() => navigate('/admin/flights/register')}>
                      <FaPlus className="me-2" />
                      Cadastrar Primeiro Voo
                    </Button>
                  </div>
                ) : (
                  <FixedColumnsTable
                    flights={flights}
                    onEdit={(id) => navigate(`/admin/flights/edit/${id}`)}
                    onDelete={handleDeleteFlight}
                  />
                )}
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

        {/* Modal de confirmação de exclusão */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Você tem certeza que deseja excluir este voo?</p>
            <p className="text-danger"><strong>Esta ação não pode ser desfeita.</strong></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteFlight}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Excluindo...
                </>
              ) : 'Excluir Voo'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  );
};

export default AdminFlights;
