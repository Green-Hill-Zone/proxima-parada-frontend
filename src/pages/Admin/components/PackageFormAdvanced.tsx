import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { getAllAccommodations } from '../../../services/AccommodationService';
import { getAllFlights } from '../../../services/FlightService';
import type { Accommodation } from '../../../services/AccommodationService';
import type { Flight } from '../../../services/FlightService';
import './PackageFormAdvanced.css';

interface PackageFormData {
  nome: string;
  destino: string;
  preco: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  hotelId: number | undefined;
  vooDaId: number | undefined;
  vooVoltaId: number | undefined;
}

interface PackageFormAdvancedProps {
  form: PackageFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  goToFinalize?: () => void;
}

const PackageFormAdvanced: React.FC<PackageFormAdvancedProps> = ({ 
  form, 
  handleChange, 
  handleSubmit, 
  goToFinalize 
}) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega hotéis e voos disponíveis
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [accommodationsData, flightsData] = await Promise.all([
          getAllAccommodations(),
          getAllFlights()
        ]);

        setAccommodations(accommodationsData);
        setFlights(flightsData);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar hotéis e voos. Verifique a conexão com o servidor.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtra voos baseado no destino selecionado
  const getAvailableFlights = (flightType: 'ida' | 'volta') => {
    if (!form.destino) return flights;

    return flights.filter(flight => {
      if (flightType === 'ida') {
        // Para voos de ida, verifica se o destino final corresponde
        return flight.finalDestination.name.toLowerCase().includes(form.destino.toLowerCase()) ||
               flight.finalDestination.city?.toLowerCase().includes(form.destino.toLowerCase());
      } else {
        // Para voos de volta, verifica se a origem corresponde ao destino do pacote
        return flight.originDestination.name.toLowerCase().includes(form.destino.toLowerCase()) ||
               flight.originDestination.city?.toLowerCase().includes(form.destino.toLowerCase());
      }
    });
  };

  // Filtra hotéis baseado no destino selecionado
  const getAvailableAccommodations = () => {
    if (!form.destino) return accommodations;

    return accommodations.filter(accommodation => 
      accommodation.destination.name.toLowerCase().includes(form.destino.toLowerCase()) ||
      accommodation.destination.city?.toLowerCase().includes(form.destino.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="package-form-loading">
        <Spinner animation="border" className="spinner-border" />
        <div>Carregando hotéis e voos disponíveis...</div>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="package-form-advanced p-4">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Informações Básicas do Pacote */}
      <div className="package-form-section">
        <h6>📋 Informações Básicas</h6>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Pacote *</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Pacote Completo Rio de Janeiro"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Destino *</Form.Label>
              <Form.Control
                type="text"
                name="destino"
                value={form.destino}
                onChange={handleChange}
                placeholder="Ex: Rio de Janeiro, Brasil"
                required
              />
              <Form.Text className="text-muted">
                Este destino será usado para filtrar hotéis e voos disponíveis
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Preço Base (R$) *</Form.Label>
              <Form.Control
                type="number"
                name="preco"
                value={form.preco}
                onChange={handleChange}
                placeholder="1500"
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Descrição *</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva o que está incluído no pacote..."
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Datas */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Data de Início *</Form.Label>
              <Form.Control
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Data de Fim *</Form.Label>
              <Form.Control
                type="date"
                name="dataFim"
                value={form.dataFim}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Seleção de Hotel */}
      <div className="package-form-section">
        <h6>🏨 Acomodação</h6>
        <Form.Group className="mb-3">
          <Form.Label>Hotel/Pousada *</Form.Label>
          <Form.Select
            name="hotelId"
            value={form.hotelId || ''}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma acomodação...</option>
            {getAvailableAccommodations().map(accommodation => (
              <option key={accommodation.id} value={accommodation.id}>
                {accommodation.name} - {accommodation.destination.city} 
                {accommodation.starRating > 0 && ` (${accommodation.starRating}⭐)`}
                - R$ {accommodation.pricePerNight}/noite
              </option>
            ))}
          </Form.Select>
          {form.destino && getAvailableAccommodations().length === 0 && (
            <Form.Text className="text-warning">
              Nenhuma acomodação encontrada para este destino. Verifique se existem hotéis cadastrados.
            </Form.Text>
          )}
        </Form.Group>
      </div>

      {/* Seleção de Voos */}
      <div className="package-form-section">
        <h6>✈️ Voos</h6>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Voo de Ida *</Form.Label>
              <Form.Select
                name="vooDaId"
                value={form.vooDaId || ''}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o voo de ida...</option>
                {getAvailableFlights('ida').map(flight => (
                  <option key={`ida-${flight.id}`} value={flight.id}>
                    {flight.airline.name} {flight.flightNumber} - 
                    {flight.originDestination.city} → {flight.finalDestination.city}
                    {flight.departureDateTime && ` - ${new Date(flight.departureDateTime).toLocaleDateString('pt-BR')}`}
                    - R$ {flight.price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Voo de Volta</Form.Label>
              <Form.Select
                name="vooVoltaId"
                value={form.vooVoltaId || ''}
                onChange={handleChange}
              >
                <option value="">Selecione o voo de volta (opcional)...</option>
                {getAvailableFlights('volta').map(flight => (
                  <option key={`volta-${flight.id}`} value={flight.id}>
                    {flight.airline.name} {flight.flightNumber} - 
                    {flight.originDestination.city} → {flight.finalDestination.city}
                    {flight.departureDateTime && ` - ${new Date(flight.departureDateTime).toLocaleDateString('pt-BR')}`}
                    - R$ {flight.price}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Deixe em branco se for apenas ida ou se o cliente vai escolher o retorno separadamente
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {form.destino && getAvailableFlights('ida').length === 0 && (
          <Alert variant="warning" className="mb-3">
            Nenhum voo encontrado para este destino. Verifique se existem voos cadastrados.
          </Alert>
        )}
      </div>

      {/* Resumo do Pacote */}
      {(form.hotelId || form.vooDaId) && (
        <div className="package-summary">
          <h6>📋 Resumo do Pacote</h6>
          <ul>
            <li><strong>Pacote:</strong> {form.nome || 'Nome não definido'}</li>
            <li><strong>Destino:</strong> {form.destino || 'Destino não definido'}</li>
            {form.hotelId && (
              <li><strong>Hotel:</strong> {accommodations.find(h => h.id === Number(form.hotelId))?.name}</li>
            )}
            {form.vooDaId && (
              <li><strong>Voo de Ida:</strong> {flights.find(f => f.id === Number(form.vooDaId))?.airline.name} {flights.find(f => f.id === Number(form.vooDaId))?.flightNumber}</li>
            )}
            {form.vooVoltaId && (
              <li><strong>Voo de Volta:</strong> {flights.find(f => f.id === Number(form.vooVoltaId))?.airline.name} {flights.find(f => f.id === Number(form.vooVoltaId))?.flightNumber}</li>
            )}
            <li><strong>Período:</strong> {form.dataInicio} até {form.dataFim}</li>
            <li><strong>Preço Base:</strong> R$ {form.preco || '0'}</li>
          </ul>
        </div>
      )}

      {/* Botões */}
      <div className="mt-4">
        <button 
          type="submit" 
          className="btn btn-primary w-100 mb-2"
        >
          Cadastrar Pacote Completo
        </button>
        {goToFinalize && (
          <button 
            type="button" 
            className="btn btn-success w-100" 
            onClick={goToFinalize}
          >
            Próxima etapa
          </button>
        )}
      </div>
    </Form>
  );
};

export default PackageFormAdvanced;
