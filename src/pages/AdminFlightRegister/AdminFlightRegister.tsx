import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Airline } from "../../services/AirlineService";
import { getAllAirlines } from "../../services/AirlineService";
import type { Destination } from "../../services/DestinationService";
import { getAllDestinations } from "../../services/DestinationService";
import type { FlightCreateRequest } from "../../services/FlightService";
import { createFlight } from "../../services/FlightService";
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import CombinedFlightForm from "../Admin/components/CombinedFlightForm";

const AdminFlightRegister = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.ADMIN_FLIGHT_REGISTER);
  const navigate = useNavigate();

  // Estado para mensagens de erro/sucesso
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para armazenar as companhias aéreas e destinos
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoadingAirlines, setIsLoadingAirlines] = useState(false);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);

  // Carregar companhias aéreas e destinos ao inicializar o componente
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingAirlines(true);
      setIsLoadingDestinations(true);

      try {
        // Carregar companhias aéreas
        const airlinesList = await getAllAirlines();
        setAirlines(airlinesList);
      } catch (error) {
        console.error("Erro ao carregar companhias aéreas:", error);
        setAlertMessage({
          type: 'danger',
          text: 'Erro ao carregar lista de companhias aéreas. Por favor, tente novamente mais tarde.'
        });
      } finally {
        setIsLoadingAirlines(false);
      }

      try {
        // Carregar destinos
        const destinationsList = await getAllDestinations();
        setDestinations(destinationsList);
      } catch (error) {
        console.error("Erro ao carregar destinos:", error);
        setAlertMessage({
          type: 'danger',
          text: 'Erro ao carregar lista de destinos. Por favor, tente novamente mais tarde.'
        });
      } finally {
        setIsLoadingDestinations(false);
      }
    };

    fetchData();
  }, []);

  // Voo
  const [flight, setFlight] = useState({
    companhia: "", // airlineId
    numero: "",    // flightNumber
    origem: "",    // originDestinationId
    destino: "",   // finalDestinationId
    data: "",      // para departureDateTime
    horario: "",   // para departureDateTime
    dataChegada: "", // para arrivalDateTime
    horarioChegada: "", // para arrivalDateTime
    cabineClasse: "Econômica", // cabinClass
    assentoClasse: "Standard", // seatClass
    preco: "",     // price
    assentos: ""   // availableSeats
  });

  // Tipo de Voo
  const [flightType, setFlightType] = useState({
    nome: "",
    descricao: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlertMessage(null);

    try {
      // Formatar as datas para o backend
      const departureDatetime = `${flight.data}T${flight.horario}:00`;
      const arrivalDatetime = `${flight.dataChegada}T${flight.horarioChegada}:00`;

      // Converter os IDs de string para número
      const airlineId = parseInt(flight.companhia, 10);
      const originDestinationId = parseInt(flight.origem, 10);
      const finalDestinationId = parseInt(flight.destino, 10);
      const price = flight.preco ? parseFloat(flight.preco) : 0;
      const availableSeats = flight.assentos ? parseInt(flight.assentos, 10) : 0;

      // Criar o objeto para enviar ao backend
      const flightData: FlightCreateRequest = {
        airlineId,
        originDestinationId,
        finalDestinationId,
        flightNumber: flight.numero,
        departureDateTime: departureDatetime,
        arrivalDateTime: arrivalDatetime,
        cabinClass: flight.cabineClasse,
        seatClass: flight.assentoClasse,
        price,
        availableSeats
      };

      console.log("Enviando dados para API:", flightData);

      // Chamar o serviço de criação
      const createdFlight = await createFlight(flightData);

      console.log("Voo cadastrado com sucesso:", createdFlight);

      setAlertMessage({
        type: 'success',
        text: `Voo ${createdFlight.flightNumber} cadastrado com sucesso!`
      });

      // Reset dos formulários
      setFlight({
        companhia: "",
        numero: "",
        origem: "",
        destino: "",
        data: "",
        horario: "",
        dataChegada: "",
        horarioChegada: "",
        cabineClasse: "Econômica",
        assentoClasse: "Standard",
        preco: "",
        assentos: ""
      });

      setFlightType({
        nome: "",
        descricao: ""
      });

      // Redirecionar após um curto delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/admin/flights');
      }, 2000);

    } catch (error) {
      console.error("Erro ao cadastrar voo:", error);

      setAlertMessage({
        type: 'danger',
        text: error instanceof Error ? error.message : 'Ocorreu um erro ao cadastrar o voo. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFlightChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlight(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFlightTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFlightType(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <h3>{isSubmitting ? 'Cadastrando Voo...' : 'Cadastrar Novo Voo'}</h3>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            disabled={isSubmitting}
          >
            ← Dashboard
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/admin/flights')}
          disabled={isSubmitting}
        >
          Voltar para Voos
        </Button>
      </div>

      {alertMessage && (
        <Alert variant={alertMessage.type} className="mb-4">
          {alertMessage.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Adaptar dados para o CombinedFlightForm existente */}
        <CombinedFlightForm
          flight={{
            companhia: flight.companhia,
            numero: flight.numero,
            origem: flight.origem,
            destino: flight.destino,
            data: flight.data,
            horario: flight.horario
          }}
          flightType={flightType}
          handleSubmit={handleSubmit}
          handleFlightChange={handleFlightChange}
          handleFlightTypeChange={handleFlightTypeChange}
          airlines={airlines}
          destinations={destinations}
          isLoadingAirlines={isLoadingAirlines}
          isLoadingDestinations={isLoadingDestinations}
        />

        {/* Campos adicionais que não estão no CombinedFlightForm */}
        <Row className="mb-3">
          <Col md={6}>
            <div className="mb-3">
              <label className="form-label">Data de Chegada</label>
              <input
                type="date"
                className="form-control"
                name="dataChegada"
                value={flight.dataChegada}
                onChange={handleFlightChange}
                required
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <label className="form-label">Horário de Chegada</label>
              <input
                type="time"
                className="form-control"
                name="horarioChegada"
                value={flight.horarioChegada}
                onChange={handleFlightChange}
                required
              />
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
            <div className="mb-3">
              <label className="form-label">Classe da Cabine</label>
              <select
                className="form-select"
                name="cabineClasse"
                value={flight.cabineClasse}
                onChange={handleFlightChange}
              >
                <option value="Econômica">Econômica</option>
                <option value="Executiva">Executiva</option>
                <option value="Primeira">Primeira Classe</option>
              </select>
            </div>
          </Col>
          <Col md={3}>
            <div className="mb-3">
              <label className="form-label">Classe do Assento</label>
              <select
                className="form-select"
                name="assentoClasse"
                value={flight.assentoClasse}
                onChange={handleFlightChange}
              >
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Extra">Extra</option>
              </select>
            </div>
          </Col>
          <Col md={3}>
            <div className="mb-3">
              <label className="form-label">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                name="preco"
                value={flight.preco}
                onChange={handleFlightChange}
                required
              />
            </div>
          </Col>
          <Col md={3}>
            <div className="mb-3">
              <label className="form-label">Assentos Disponíveis</label>
              <input
                type="number"
                step="1"
                min="0"
                className="form-control"
                name="assentos"
                value={flight.assentos}
                onChange={handleFlightChange}
                required
              />
            </div>
          </Col>
        </Row>

        {/* Botões de Ação */}
        <Row className="mt-4">
          <Col>
            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Voo'}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate('/admin/flights')}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default AdminFlightRegister;
