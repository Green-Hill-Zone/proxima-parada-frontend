import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  deleteAccommodation,
  formatPrice,
  getAllAccommodations,
  type Accommodation
} from '../../services/AccommodationService';
import HotelForm from '../Admin/components/HotelForm';

const AdminHotels = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar hotéis do backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllAccommodations();
        setHotels(data);
        console.log('Hotéis carregados:', data);
      } catch (err) {
        console.error('Erro ao carregar hotéis:', err);
        setError('Não foi possível carregar os hotéis. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Estados para controlar modais
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Estado do formulário (adaptado para HotelFormData)
  const [hotel, setHotel] = useState({
    nome: '',
    descricao: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estrelas: '',
    preco: '',
    email: '',
    telefone: '',
    checkIn: '14:00',
    checkOut: '12:00'
  });

  // Manipulador para abrir modal de confirmação de exclusão
  const handleDeleteHotel = (id: number) => {
    setSelectedHotelId(id);
    setShowDeleteModal(true);
  };

  // Confirmar exclusão de hotel
  const confirmDeleteHotel = async () => {
    if (!selectedHotelId) return;

    setDeleteLoading(true);
    try {
      const success = await deleteAccommodation(selectedHotelId);
      if (success) {
        // Remover hotel da lista local para atualização imediata da UI
        setHotels(hotels.filter(hotel => hotel.id !== selectedHotelId));
        setShowDeleteModal(false);
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao excluir hotel:', err);
      setError('Falha ao excluir o hotel. Tente novamente.');
    } finally {
      setDeleteLoading(false);
      setSelectedHotelId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Hotel cadastrado:', hotel);
    setShowModal(false);
    // Reset form
    setHotel({
      nome: '',
      descricao: '',
      endereco: '',
      numero: '',
      bairro: '',
      cidade: '',
      estrelas: '',
      preco: '',
      email: '',
      telefone: '',
      checkIn: '14:00',
      checkOut: '12:00'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="admin-hotels-main" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container>
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-3">
                <h1>Gerenciar Acomodações</h1>
                <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
                  ← Dashboard
                </Button>
              </div>
              <Button variant="primary" onClick={() => navigate('/admin/hotels/register')}>
                <FaPlus className="me-2" />
                Nova Acomodação
              </Button>
            </div>

            <Card>
              <Card.Body>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center p-5">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Carregando hotéis...</span>
                  </div>
                ) : error ? (
                  <Alert variant="danger">
                    <Alert.Heading>Erro ao carregar dados</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => window.location.reload()}>
                      Tentar novamente
                    </Button>
                  </Alert>
                ) : hotels.length === 0 ? (
                  <div className="text-center p-5">
                    <p className="mb-3">Nenhuma acomodação encontrada</p>
                    <Button variant="primary" onClick={() => navigate('/admin/hotels/register')}>
                      <FaPlus className="me-2" />
                      Cadastrar Primeira Acomodação
                    </Button>
                  </div>
                ) : (
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Cidade</th>
                        <th>País</th>
                        <th>Estrelas</th>
                        <th>Preço/Noite</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotels.map((hotel) => (
                        <tr key={hotel.id}>
                          <td>{hotel.name}</td>
                          <td>{hotel.destination.city || '-'}</td>
                          <td>{hotel.destination.country}</td>
                          <td>
                            {'★'.repeat(hotel.starRating)}
                          </td>
                          <td>{formatPrice(hotel.pricePerNight)}</td>
                          <td>
                            <span className="badge bg-success">
                              Ativo
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => navigate(`/admin/hotels/edit/${hotel.id}`)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteHotel(hotel.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal para criar/editar hotel */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Cadastrar Nova Acomodação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <HotelForm
              hotel={hotel}
              setHotel={setHotel}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Salvar Hotel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de confirmação de exclusão */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Você tem certeza que deseja excluir esta acomodação?</p>
            <p className="text-danger"><strong>Esta ação não pode ser desfeita.</strong></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteHotel}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Excluindo...
                </>
              ) : 'Excluir Acomodação'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  );
};

export default AdminHotels;
