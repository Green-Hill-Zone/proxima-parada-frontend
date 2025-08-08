import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { FaBox, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PAGE_TITLES, usePageTitle } from '../../hooks';
import { getTravelPackageById, getTravelPackages } from '../../services/TravelPackageService';

// Usar a interface do TravelPackage do serviço ou criar uma simplificada para uso interno
interface Package {
  Id: number | string;
  Name: string;
  Description?: string;
  BasePrice: number;
  Duration?: number;
  MainDestination?: {
    Name: string;
    Country: string;
  };
  IsActive?: boolean;
  availableDates?: Array<{
    departureDate: string;
    returnDate: string;
  }>;
}

const AdminPackages = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.ADMIN_PACKAGES);

  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | number | null>(null);

  // Carregar pacotes do backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTravelPackages();
        setPackages(data);
        console.log('Pacotes carregados:', data);
      } catch (err) {
        console.error('Erro ao carregar pacotes:', err);
        setError('Não foi possível carregar os pacotes. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleEdit = (packageId: string | number) => {
    navigate(`/admin/packages/edit/${packageId}`);
  };

  const handleDelete = (packageId: string | number) => {
    setSelectedPackageId(packageId);
    setShowDeleteModal(true);
  };

  const confirmDeletePackage = async () => {
    if (!selectedPackageId) return;

    setDeleteLoading(true);
    try {
      // Implementar a exclusão usando o endpoint apropriado
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102'
      });

      await api.delete(`/api/TravelPackage/${selectedPackageId}`);

      // Remover pacote da lista local para atualização imediata da UI
      setPackages(packages.filter(pkg => pkg.Id !== selectedPackageId));
      setShowDeleteModal(false);
      setError(null);
    } catch (err) {
      console.error('Erro ao excluir pacote:', err);
      setError('Falha ao excluir o pacote. Tente novamente.');
    } finally {
      setDeleteLoading(false);
      setSelectedPackageId(null);
    }
  };

  const toggleStatus = async (packageId: string | number) => {
    setStatusLoading(packageId);
    try {
      // Buscar o pacote atual para saber seu status
      const packageDetails = await getTravelPackageById(Number(packageId));

      if (!packageDetails) {
        throw new Error('Não foi possível encontrar os detalhes do pacote');
      }

      // Criar API para alteração de status
      const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102'
      });

      // Alternar o status do pacote
      const updatedStatus = !(packageDetails.IsActive || false);

      // Chamada para atualizar status
      await api.patch(`/api/TravelPackage/${packageId}/status`, { isActive: updatedStatus });

      // Atualizar status do pacote na lista local
      setPackages(packages.map(pkg =>
        pkg.Id === packageId ? { ...pkg, IsActive: updatedStatus } : pkg
      ));
    } catch (err) {
      console.error('Erro ao alterar status do pacote:', err);
      setError('Falha ao alterar status do pacote. Tente novamente.');
    } finally {
      setStatusLoading(null);
    }
  };

  // Função para calcular duração com base nas datas disponíveis
  const calculateDuration = (pkg: Package): number => {
    if (pkg.Duration) return pkg.Duration;

    if (pkg.availableDates && pkg.availableDates.length > 0) {
      const departureDate = new Date(pkg.availableDates[0].departureDate);
      const returnDate = new Date(pkg.availableDates[0].returnDate);

      // Calcular diferença em dias
      const diffTime = returnDate.getTime() - departureDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }

    return 7; // Valor padrão caso não haja informação
  };

  return (
    <main className="admin-packages-main" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container>
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-3">
                <h1><FaBox className="me-2" />Gerenciar Pacotes</h1>
                <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
                  ← Dashboard
                </Button>
              </div>
              <Button variant="primary" onClick={() => navigate('/admin/packages/register')}>
                <FaPlus className="me-2" />
                Novo Pacote
              </Button>
            </div>

            <Card>
              <Card.Body>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center p-5">
                    <Spinner animation="border" role="status" className="me-2" />
                    <span>Carregando pacotes...</span>
                  </div>
                ) : error ? (
                  <Alert variant="danger">
                    <Alert.Heading>Erro ao carregar dados</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => window.location.reload()}>
                      Tentar novamente
                    </Button>
                  </Alert>
                ) : packages.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">Nenhum pacote cadastrado ainda.</p>
                    <Button variant="primary" onClick={() => navigate('/admin/packages/register')}>
                      <FaPlus className="me-2" />
                      Cadastrar Primeiro Pacote
                    </Button>
                  </div>
                ) : (
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Destino</th>
                        <th>Duração</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg) => (
                        <tr key={pkg.Id}>
                          <td>
                            <strong>{pkg.Name}</strong>
                            <br />
                            <small className="text-muted">{pkg.Description || 'Sem descrição'}</small>
                          </td>
                          <td>
                            {pkg.MainDestination?.Name || 'N/A'}
                            <br />
                            <small className="text-muted">{pkg.MainDestination?.Country || ''}</small>
                          </td>
                          <td>{calculateDuration(pkg)} dias</td>
                          <td>R$ {pkg.BasePrice?.toFixed(2) || '0.00'}</td>
                          <td>
                            {statusLoading === pkg.Id ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <Badge
                                bg={pkg.IsActive ? 'success' : 'secondary'}
                                style={{ cursor: 'pointer' }}
                                onClick={() => toggleStatus(pkg.Id)}
                              >
                                {pkg.IsActive ? 'Ativo' : 'Inativo'}
                              </Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(pkg.Id)}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(pkg.Id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
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

        {/* Modal de confirmação de exclusão */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Você tem certeza que deseja excluir este pacote de viagem?</p>
            <p className="text-danger"><strong>Esta ação não pode ser desfeita.</strong></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeletePackage}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Excluindo...
                </>
              ) : 'Excluir Pacote'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  );
};

export default AdminPackages;