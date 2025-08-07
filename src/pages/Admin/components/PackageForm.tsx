import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { getAllDestinations, type Destination } from "../../../services/DestinationService";

type Props = {
  form: any;
  setForm: (cb: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const PackageForm: React.FC<Props> = ({ form, setForm, handleSubmit, handleChange }) => {
  // Estados para gerenciar destinos
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);

  // Carregar destinos ao montar o componente
  useEffect(() => {
    const loadDestinations = async () => {
      setLoadingDestinations(true);
      try {
        const destinationsData = await getAllDestinations();
        setDestinations(destinationsData);

        // Se já tiver um destino selecionado no form, seleciona-o
        if (form.destinationId) {
          setSelectedDestinationId(form.destinationId);
        } else if (destinationsData.length > 0) {
          // Se não, seleciona o primeiro destino da lista
          setSelectedDestinationId(destinationsData[0].id);
          // Atualiza o form com o destino selecionado
          setForm((prev: any) => ({
            ...prev,
            destinationId: destinationsData[0].id,
            destino: destinationsData[0].name
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar destinos:", err);
      } finally {
        setLoadingDestinations(false);
      }
    };

    loadDestinations();
  }, []);

  // Handler para alteração de destino
  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const destinationId = Number(e.target.value);
    setSelectedDestinationId(destinationId);

    // Encontra o destino selecionado
    const selectedDestination = destinations.find(d => d.id === destinationId);

    // Atualiza o form com o destino selecionado
    setForm((prev: any) => ({
      ...prev,
      destinationId: destinationId,
      destino: selectedDestination?.name || ""
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-light p-4 rounded-3 border">
      <div className="mb-3">
        <label className="form-label">Nome do Pacote</label>
        <input type="text" className="form-control" name="nome" value={form.nome} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <Form.Group controlId="destination">
          <Form.Label>Destino</Form.Label>
          {loadingDestinations ? (
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              <span className="text-muted">Carregando destinos...</span>
            </div>
          ) : (
            <Form.Select
              name="destinationId"
              value={selectedDestinationId || ''}
              onChange={handleDestinationChange}
              required
            >
              <option value="">Selecione um destino</option>
              {destinations.map(destination => (
                <option key={destination.id} value={destination.id}>
                  {destination.name} ({destination.city}, {destination.country})
                </option>
              ))}
            </Form.Select>
          )}
          <Form.Text className="text-muted">
            Escolha o destino para este pacote de viagem
          </Form.Text>
        </Form.Group>
      </div>

      <div className="mb-3">
        <label className="form-label">Preço</label>
        <input type="number" className="form-control" name="preco" value={form.preco} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Descrição</label>
        <textarea className="form-control" name="descricao" value={form.descricao} onChange={handleChange} rows={3} required />
      </div>
      <div className="row mb-3">
        <div className="col">
          <label className="form-label">Data de Início</label>
          <input type="date" className="form-control" name="dataInicio" value={form.dataInicio} onChange={handleChange} required />
        </div>
        <div className="col">
          <label className="form-label">Data de Fim</label>
          <input type="date" className="form-control" name="dataFim" value={form.dataFim} onChange={handleChange} required />
        </div>
      </div>
    </form>
  );
};

export default PackageForm;