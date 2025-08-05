import { useState } from 'react';
import { Button, Card, Col, Container, Modal, Row, Table } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import HotelForm from '../Admin/components/HotelForm';

interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  pricePerNight: number;
  isActive: boolean;
}

const AdminHotels = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.ADMIN_HOTELS);
  
  const navigate = useNavigate();
  const [hotels] = useState<Hotel[]>([
    {
      id: '1',
      name: 'Hotel Paradise Resort',
      city: 'Cancún',
      country: 'México',
      stars: 5,
      pricePerNight: 450.00,
      isActive: true
    },
    {
      id: '2',
      name: 'Beach View Hotel',
      city: 'Rio de Janeiro',
      country: 'Brasil',
      stars: 4,
      pricePerNight: 280.00,
      isActive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [hotel, setHotel] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estrelas: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Hotel cadastrado:', hotel);
    setShowModal(false);
    // Reset form
    setHotel({
      nome: '',
      endereco: '',
      cidade: '',
      estrelas: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                <h1>Gerenciar Hotéis</h1>
                <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
                  ← Dashboard
                </Button>
              </div>
              <Button variant="primary" onClick={() => navigate('/admin/hotels/register')}>
                <FaPlus className="me-2" />
                Novo Hotel
              </Button>
            </div>

            <Card>
              <Card.Body>
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
                        <td>{hotel.city}</td>
                        <td>{hotel.country}</td>
                        <td>
                          {'★'.repeat(hotel.stars)}
                        </td>
                        <td>R$ {hotel.pricePerNight.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${hotel.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {hotel.isActive ? 'Ativo' : 'Inativo'}
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

        {/* Modal para criar/editar hotel */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Cadastrar Novo Hotel</Modal.Title>
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
      </Container>
    </main>
  );
};

export default AdminHotels;
