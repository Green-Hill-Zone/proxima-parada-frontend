import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import { FaArrowDown, FaArrowUp, FaChartLine, FaDollarSign, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePageTitle, PAGE_TITLES } from '../../hooks';

const AdminSalesReports = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.ADMIN_SALES);
  
  const navigate = useNavigate();
  const salesData = [
    { id: '1', customerName: 'João Silva', package: 'Paris Romântico', amount: 4500.00, date: '28/07/2025', status: 'Pago' },
    { id: '2', customerName: 'Maria Santos', package: 'Cancún Tropical', amount: 3200.00, date: '27/07/2025', status: 'Pendente' },
    { id: '3', customerName: 'Carlos Oliveira', package: 'Nova York Urbano', amount: 5800.00, date: '26/07/2025', status: 'Pago' },
    { id: '4', customerName: 'Ana Costa', package: 'Tóquio Cultural', amount: 7200.00, date: '25/07/2025', status: 'Pago' },
  ];

  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.amount, 0);
  const paidSales = salesData.filter(sale => sale.status === 'Pago');
  const totalPaidRevenue = paidSales.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <main className="admin-sales-main" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container>
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h1><FaChartLine className="me-2" />Relatórios de Vendas</h1>
                <p className="text-muted">Acompanhe o desempenho das vendas e receitas</p>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
                ← Dashboard
              </Button>
            </div>
          </Col>
        </Row>

        {/* Cards de estatísticas */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaDollarSign size={32} className="text-success mb-2" />
                <h4 className="text-success">R$ {totalPaidRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                <p className="mb-0">Receita Confirmada</p>
                <small className="text-success">
                  <FaArrowUp className="me-1" />12% vs mês anterior
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaShoppingCart size={32} className="text-primary mb-2" />
                <h4 className="text-primary">{salesData.length}</h4>
                <p className="mb-0">Vendas Totais</p>
                <small className="text-success">
                  <FaArrowUp className="me-1" />8% vs mês anterior
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaUsers size={32} className="text-info mb-2" />
                <h4 className="text-info">{new Set(salesData.map(sale => sale.customerName)).size}</h4>
                <p className="mb-0">Clientes Únicos</p>
                <small className="text-danger">
                  <FaArrowDown className="me-1" />3% vs mês anterior
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <FaChartLine size={32} className="text-warning mb-2" />
                <h4 className="text-warning">R$ {(totalPaidRevenue / paidSales.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                <p className="mb-0">Ticket Médio</p>
                <small className="text-success">
                  <FaArrowUp className="me-1" />5% vs mês anterior
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabela de vendas recentes */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Vendas Recentes</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Pacote</th>
                      <th>Valor</th>
                      <th>Data</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((sale) => (
                      <tr key={sale.id}>
                        <td>{sale.customerName}</td>
                        <td>{sale.package}</td>
                        <td>R$ {sale.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>{sale.date}</td>
                        <td>
                          <span className={`badge ${sale.status === 'Pago' ? 'bg-success' : 'bg-warning'}`}>
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Resumo por período */}
        <Row className="mt-4">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Vendas por Status</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Pagas</span>
                  <span className="text-success font-weight-bold">{paidSales.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Pendentes</span>
                  <span className="text-warning font-weight-bold">{salesData.length - paidSales.length}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total</span>
                  <span className="font-weight-bold">{salesData.length}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Receita por Status</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Confirmada</span>
                  <span className="text-success font-weight-bold">
                    R$ {totalPaidRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Pendente</span>
                  <span className="text-warning font-weight-bold">
                    R$ {(totalRevenue - totalPaidRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total</span>
                  <span className="font-weight-bold">
                    R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminSalesReports;
