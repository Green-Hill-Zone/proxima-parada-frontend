import React, { useState, useEffect } from "react";
import { Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PackageForm from "../Admin/components/PackageForm";
import { createTravelPackageBackend, addFlightsToPackage } from "../../services/TravelPackageService";
import { getAllFlights, type Flight } from "../../services/FlightService";
import { getAllAccommodations, type Accommodation } from "../../services/AccommodationService";

const AdminPackageRegister = () => {
  const navigate = useNavigate();

  // Estados para controle da UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estados para flights e accommodations
  const [flights, setFlights] = useState<Flight[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [loadingAccommodations, setLoadingAccommodations] = useState(false);
  
  // Estados para seleção específica: 2 voos (ida/volta) + 1 acomodação
  const [selectedOutboundFlightId, setSelectedOutboundFlightId] = useState<number | null>(null);
  const [selectedReturnFlightId, setSelectedReturnFlightId] = useState<number | null>(null);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<number | null>(null);

  // Pacote - campos mapeados para o backend
  const [form, setForm] = useState({
    nome: "",        // Mapeia para Title
    destino: "",     // Será usado para criar/buscar Destination
    preco: "",       // Mapeia para Price
    descricao: "",   // Mapeia para Description
    dataInicio: "",  // Mapeia para DepartureDate
    dataFim: ""      // Mapeia para ReturnDate
  });

  // Carregar flights e accommodations ao montar o componente
  useEffect(() => {
    const loadFlightsAndAccommodations = async () => {
      // Carregar flights
      setLoadingFlights(true);
      try {
        const flightsData = await getAllFlights();
        setFlights(flightsData);
      } catch (error) {
        console.error('Erro ao carregar voos:', error);
      } finally {
        setLoadingFlights(false);
      }

      // Carregar accommodations
      setLoadingAccommodations(true);
      try {
        const accommodationsData = await getAllAccommodations();
        setAccommodations(accommodationsData);
      } catch (error) {
        console.error('Erro ao carregar acomodações:', error);
      } finally {
        setLoadingAccommodations(false);
      }
    };

    loadFlightsAndAccommodations();
  }, []);

  // Funções auxiliares para renderização
  const getFlightDisplayName = (flight: Flight): string => {
    return `${flight.airline?.name || 'N/A'} - ${flight.flightNumber || 'N/A'}`;
  };

  const getFlightRoute = (flight: Flight): string => {
    return `${flight.originDestination?.name || 'Origem N/A'} → ${flight.finalDestination?.name || 'Destino N/A'}`;
  };

  const getAccommodationDisplayName = (accommodation: Accommodation): string => {
    return accommodation.name || 'N/A';
  };

  const getAccommodationDescription = (accommodation: Accommodation): string => {
    return `${accommodation.district || ''} - ${accommodation.destination?.name || 'N/A'} (${accommodation.starRating || 0}⭐)`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar mensagens de erro/sucesso quando o usuário edita
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return; // Previne submissões múltiplas
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log("🔄 Cadastrando pacote...", form);
      
      // Validações básicas
      if (!form.nome.trim()) {
        throw new Error("Nome do pacote é obrigatório");
      }
      
      if (!form.preco || parseFloat(form.preco) <= 0) {
        throw new Error("Preço deve ser um valor válido maior que zero");
      }
      
      if (!form.dataInicio || !form.dataFim) {
        throw new Error("Datas de início e fim são obrigatórias");
      }
      
      if (new Date(form.dataInicio) >= new Date(form.dataFim)) {
        throw new Error("Data de início deve ser anterior à data de fim");
      }

      // Preparar dados para o backend conforme TravelPackageDto
      const packageData = {
        Title: form.nome.trim(),
        Description: form.descricao.trim() || null,
        Price: parseFloat(form.preco),
        DepartureDate: form.dataInicio ? new Date(form.dataInicio).toISOString() : null,
        ReturnDate: form.dataFim ? new Date(form.dataFim).toISOString() : null,
        DestinationId: 1, // Por enquanto usando ID fixo - pode ser expandido depois
        CompanyId: 1      // Por enquanto usando ID fixo - pode ser expandido depois
      };

      console.log("📤 Dados sendo enviados para o backend:", packageData);

      // Chamar o serviço para criar o pacote
      const createdPackage = await createTravelPackageBackend(packageData);

      if (createdPackage && createdPackage.TravelPackageId) {
        const packageId = createdPackage.TravelPackageId;
        console.log("✅ Pacote cadastrado com sucesso. ID:", packageId);

        // Adicionar flights ao pacote (se houver selecionados)
        const flightIdsToAdd: number[] = [];
        if (selectedOutboundFlightId) flightIdsToAdd.push(selectedOutboundFlightId);
        if (selectedReturnFlightId) flightIdsToAdd.push(selectedReturnFlightId);
        
        if (flightIdsToAdd.length > 0) {
          try {
            console.log("✈️ Adicionando voos ao pacote...", flightIdsToAdd);
            await addFlightsToPackage(packageId, flightIdsToAdd);
            console.log("✅ Voos adicionados com sucesso");
          } catch (flightError) {
            console.warn("⚠️ Erro ao adicionar voos:", flightError);
            // Não falha o processo principal, apenas loga o aviso
          }
        }

        // Adicionar accommodations ao pacote (se houver selecionado)
        if (selectedAccommodationId) {
          try {
            console.log("🏨 Adicionando acomodação ao pacote...", selectedAccommodationId);
            // Nota: Endpoint de acomodações ainda não implementado no backend
            console.log("ℹ️ Endpoint de acomodações ainda não implementado no backend");
          } catch (accommodationError) {
            console.warn("⚠️ Erro ao adicionar acomodação:", accommodationError);
          }
        }

        setSuccess(true);
        
        // Reset do formulário
        setForm({
          nome: "",
          destino: "",
          preco: "",
          descricao: "",
          dataInicio: "",
          dataFim: ""
        });
        
        // Limpar seleções
        setSelectedOutboundFlightId(null);
        setSelectedReturnFlightId(null);
        setSelectedAccommodationId(null);

        // Mostrar mensagem de sucesso por alguns segundos antes de navegar
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        throw new Error("Erro ao criar pacote - resposta inválida do servidor");
      }
      
    } catch (error: unknown) {
      console.error('❌ Erro ao cadastrar pacote:', error);
      
      let errorMessage = "Erro desconhecido ao cadastrar pacote";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        const err = error as { response?: { data?: { message?: string }; status?: number } };
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.status) {
          errorMessage = `Erro do servidor: ${err.response.status}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <h3>Cadastrar Novo Pacote</h3>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
            ← Dashboard
          </Button>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/packages')}>
          Voltar para Pacotes
        </Button>
      </div>

      {/* Mensagens de Status */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <Alert.Heading>❌ Erro ao cadastrar pacote</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
          <Alert.Heading>✅ Sucesso!</Alert.Heading>
          <p>Pacote cadastrado com sucesso! Redirecionando para o dashboard...</p>
        </Alert>
      )}

      <form onSubmit={handlePackageSubmit}>
        {/* Formulário do Pacote */}
        <div className="mb-4">
          <h5>Informações do Pacote</h5>
          <PackageForm
            form={form}
            setForm={setForm}
            handleSubmit={handlePackageSubmit}
            handleChange={handleChange}
            goToFinalize={() => {}} // Não usado nesta página
          />
        </div>

        {/* Seleção de Voos */}
        <div className="mb-4">
          <h5>✈️ Seleção de Voos</h5>
          <div className="row">
            {/* Voo de Ida */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="me-2">🛫</i>
                Voo de Ida
              </label>
              {loadingFlights ? (
                <div className="d-flex align-items-center text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Carregando voos...
                </div>
              ) : (
                <select 
                  className="form-select"
                  value={selectedOutboundFlightId || ''}
                  onChange={(e) => setSelectedOutboundFlightId(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">Selecione um voo de ida</option>
                  {flights.map(flight => (
                    <option key={`outbound-${flight.id}`} value={flight.id}>
                      {getFlightDisplayName(flight)} - {getFlightRoute(flight)} - R$ {flight.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Voo de Volta */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                <i className="me-2">🛬</i>
                Voo de Volta
              </label>
              {loadingFlights ? (
                <div className="d-flex align-items-center text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Carregando voos...
                </div>
              ) : (
                <select 
                  className="form-select"
                  value={selectedReturnFlightId || ''}
                  onChange={(e) => setSelectedReturnFlightId(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">Selecione um voo de volta</option>
                  {flights.map(flight => (
                    <option key={`return-${flight.id}`} value={flight.id}>
                      {getFlightDisplayName(flight)} - {getFlightRoute(flight)} - R$ {flight.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Seleção de Acomodação */}
        <div className="mb-4">
          <h5>🏨 Seleção de Acomodação</h5>
          <div className="col-md-8">
            <label className="form-label">Acomodação</label>
            {loadingAccommodations ? (
              <div className="d-flex align-items-center text-muted">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Carregando acomodações...
              </div>
            ) : (
              <select 
                className="form-select"
                value={selectedAccommodationId || ''}
                onChange={(e) => setSelectedAccommodationId(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Selecione uma acomodação</option>
                {accommodations.map(accommodation => (
                  <option key={accommodation.id} value={accommodation.id}>
                    {getAccommodationDisplayName(accommodation)} - {getAccommodationDescription(accommodation)} - R$ {accommodation.pricePerNight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/noite
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cadastrando...
              </>
            ) : (
              'Cadastrar Pacote'
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/dashboard')}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>

        {/* Resumo das Seleções */}
        {(selectedOutboundFlightId || selectedReturnFlightId || selectedAccommodationId) && (
          <div className="mt-3 p-3 bg-light rounded">
            <h6>📋 Resumo das Seleções:</h6>
            {selectedOutboundFlightId && (
              <div className="text-primary">
                ✈️ Voo de ida selecionado: {getFlightDisplayName(flights.find(f => f.id === selectedOutboundFlightId)!)}
              </div>
            )}
            {selectedReturnFlightId && (
              <div className="text-primary">
                🔄 Voo de volta selecionado: {getFlightDisplayName(flights.find(f => f.id === selectedReturnFlightId)!)}
              </div>
            )}
            {selectedAccommodationId && (
              <div className="text-success">
                🏨 Acomodação selecionada: {getAccommodationDisplayName(accommodations.find(a => a.id === selectedAccommodationId)!)}
              </div>
            )}
            <small className="text-muted">
              Esses itens serão associados ao pacote após o cadastro.
            </small>
          </div>
        )}
      </form>
    </Container>
  );
};

export default AdminPackageRegister;
