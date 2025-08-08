import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

type Props = {
  form: {
    nome: string;
    destino: string;
    destinationId: number;
    preco: string;
    descricao: string;
    dataInicio: string;
    dataFim: string;
  };
  setForm: (cb: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  destinations?: any[];
  loadingDestinations?: boolean;
};

const PackageForm: React.FC<Props> = ({
  form,
  setForm,
  handleSubmit,
  handleChange,
  destinations = [],
  loadingDestinations = false
}) => {

  // Handler para alteração de destino
  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const destinationId = Number(e.target.value);

    // Encontra o destino selecionado
    const selectedDestination = destinations.find(d => d.id === destinationId);

    // Atualiza o form com o destino selecionado
    setForm((prev: any) => ({
      ...prev,
      destino: selectedDestination?.name || "",
      destinationId: destinationId    // Atualiza o ID do destino
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-light p-4 rounded-3 border">
      <Row className="mb-3">
        <Col md={8}>
          <Form.Group controlId="nome">
            <Form.Label>Nome do Pacote *</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              placeholder="Ex: Verão em Cancún"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="preco">
            <Form.Label>Preço (R$) *</Form.Label>
            <Form.Control
              type="number"
              name="preco"
              value={form.preco}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="2499.90"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="destinationId">
            <Form.Label>Destino *</Form.Label>
            {loadingDestinations ? (
              <div className="d-flex align-items-center text-muted">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Carregando destinos...
              </div>
            ) : (
              <Form.Select
                name="destinationId"
                value={form.destinationId || ''}
                onChange={handleDestinationChange}
                required
              >
                <option value="">Selecione um destino</option>
                {destinations.map(destination => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name} - {destination.country}
                    {destination.state && `, ${destination.state}`}
                    {destination.city && `, ${destination.city}`}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="dataInicio">
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
          <Form.Group controlId="dataFim">
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

      <Form.Group controlId="descricao" className="mb-3">
        <Form.Label>Descrição</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descreva detalhes sobre o pacote de viagem..."
        />
      </Form.Group>
    </form>
  );
};

export default PackageForm;