import { useState } from 'react';
import { Button, Card, Col, Container, Row, Table, Badge } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash, FaBox } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePageTitle, PAGE_TITLES } from '../../hooks';

interface Package {
  id: string;
  name: string;
  destination: string;
  duration: number;
  price: number;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const AdminPackages = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.ADMIN_PACKAGES);
  
  const navigate = useNavigate();
  const [packages] = useState<Package[]>([
    {
      id: '1',
      name: 'Pacote Cancún Completo',
      destination: 'Cancún, México',
      duration: 7,
      price: 2890.00,
      description: 'Pacote completo para Cancún com hotel 5 estrelas e voos inclusos',
      startDate: '2025-03-15',
      endDate: '2025-03-22',
      isActive: true
    },
    {
      id: '2',
      name: 'Rio de Janeiro Especial',
      destination: 'Rio de Janeiro, Brasil',
      duration: 5,
      price: 1650.00,
      description: 'Conheça as principais atrações do Rio de Janeiro',
      startDate: '2025-04-10',
      endDate: '2025-04-15',
      isActive: true
    },
    {
      id: '3',
      name: 'Buenos Aires Cultural',
      destination: 'Buenos Aires, Argentina',
      duration: 4,
      price: 1320.00,
      description: 'Roteiro cultural pela capital argentina',
      startDate: '2025-05-20',
      endDate: '2025-05-24',
      isActive: false
    }
  ]);

  const handleEdit = (packageId: string) => {
    console.log('Editar pacote:', packageId);
    // Implementar edição
  };

  const handleDelete = (packageId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pacote?')) {
      console.log('Excluir pacote:', packageId);
      // Implementar exclusão
    }
  };

  const toggleStatus = (packageId: string) => {
    console.log('Alternar status do pacote:', packageId);
    // Implementar alteração de status
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
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Destino</th>
                      <th>Duração</th>
                      <th>Preço</th>
                      <th>Data Início</th>
                      <th>Data Fim</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td>
                          <strong>{pkg.name}</strong>
                          <br />
                          <small className="text-muted">{pkg.description}</small>
                        </td>
                        <td>{pkg.destination}</td>
                        <td>{pkg.duration} dias</td>
                        <td>R$ {pkg.price.toFixed(2)}</td>
                        <td>{new Date(pkg.startDate).toLocaleDateString('pt-BR')}</td>
                        <td>{new Date(pkg.endDate).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <Badge 
                            bg={pkg.isActive ? 'success' : 'secondary'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleStatus(pkg.id)}
                          >
                            {pkg.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(pkg.id)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(pkg.id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {packages.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">Nenhum pacote cadastrado ainda.</p>
                    <Button variant="primary" onClick={() => navigate('/admin/packages/register')}>
                      <FaPlus className="me-2" />
                      Cadastrar Primeiro Pacote
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPackages;
