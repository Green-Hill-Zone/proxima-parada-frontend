import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addImagesToAccommodation, createAccommodation, type AccommodationCreateRequest } from "../../services/AccommodationService";
import { getAllDestinations, type Destination } from "../../services/DestinationService";
import { getAllRoomTypes, type RoomType } from "../../services/RoomTypeService";
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import HotelForm from "../Admin/components/HotelForm";
import ImageUpload from "../Admin/components/ImageUpload";

const AdminHotelRegister = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.ADMIN_HOTEL_REGISTER);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7102';

  // Estados para controlar o processo de envio
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estados para armazenar os dados do backend
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // IDs selecionados
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null);

  // Carrega os dados de destinos e tipos de quarto
  useEffect(() => {
    const loadData = async () => {
      setLoadingOptions(true);
      try {
        // Carrega os destinos
        const destinationsData = await getAllDestinations();
        setDestinations(destinationsData);

        // Define o primeiro destino como padrão se houver
        if (destinationsData.length > 0) {
          setSelectedDestinationId(destinationsData[0].id);
        }

        // Carrega os tipos de quarto
        const roomTypesData = await getAllRoomTypes();
        setRoomTypes(roomTypesData);

        // Define o primeiro tipo de quarto como padrão se houver
        if (roomTypesData.length > 0) {
          setSelectedRoomTypeId(roomTypesData[0].id);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Não foi possível carregar as opções de destinos e tipos de quarto.");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadData();
  }, []);

  // Dados do hotel (accommodation)
  const [hotel, setHotel] = useState({
    nome: "",
    descricao: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estrelas: "",
    preco: "",
    telefone: "",
    email: "",
    checkIn: "14:00",
    checkOut: "12:00"
  });

  // Imagens do hotel
  const [hotelImages, setHotelImages] = useState<File[]>([]);

  // Handlers
  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHotel(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Inicializa estados
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Verifica se destino e tipo de quarto foram selecionados
      if (!selectedDestinationId || !selectedRoomTypeId) {
        setError("É necessário selecionar um destino e um tipo de quarto.");
        return;
      }

      // Prepara os dados para a API conforme o formato AccommodationCreateRequest
      const accommodationData: AccommodationCreateRequest = {
        destinationId: selectedDestinationId,
        roomTypeId: selectedRoomTypeId,
        name: hotel.nome,
        description: hotel.descricao,
        streetName: hotel.endereco,
        addressNumber: hotel.numero,
        district: hotel.bairro,
        starRating: parseInt(hotel.estrelas) || 3,
        pricePerNight: parseFloat(hotel.preco) || 0,
        phone: hotel.telefone,
        email: hotel.email,
        checkInTime: hotel.checkIn + ":00", // Adiciona segundos para o formato do backend
        checkOutTime: hotel.checkOut + ":00"
      };

      // Envia os dados para a API
      const createdAccommodation = await createAccommodation(accommodationData);

      // Se a acomodação foi criada com sucesso
      if (createdAccommodation) {
        console.log("Acomodação cadastrado com sucesso:", createdAccommodation);

        // TODO: Implementar upload de imagens quando API estiver pronta
        if (hotelImages.length > 0) {

      for (const image of hotelImages) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("altText", "Foto do hotel");
        formData.append("accommodationId", createdAccommodation.id.toString());

        try {
         const response = await axios.post("http://localhost:5079/api/image", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          addImagesToAccommodation(createdAccommodation.id, [response.data.id]);
        } catch (err) {
          console.error("Erro ao enviar imagem:", image.name, err);
        }
      }



        }

        // Marca como sucesso e limpa os formulários
        setSuccess(true);

        // Reset dos formulários
        setHotel({
          nome: "",
          descricao: "",
          endereco: "",
          numero: "",
          bairro: "",
          cidade: "",
          estrelas: "",
          preco: "",
          telefone: "",
          email: "",
          checkIn: "14:00",
          checkOut: "12:00"
        });
        setHotelImages([]);

        // Mostra alerta de sucesso temporário
        alert("Hotel cadastrado com sucesso!");

        // Redireciona para a lista de hotéis
        navigate('/admin/hotels');
      }
    } catch (err) {
      // Trata erro
      console.error("Erro ao cadastrar acomodação:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao cadastrar a acomodação");
    } finally {
      // Finaliza o estado de loading
      setLoading(false);
    }
  };



  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <h3>Cadastrar Nova Acomodação</h3>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
            ← Dashboard
          </Button>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/hotels')}>
          Voltar para Acomodações
        </Button>
      </div>

      {/* Exibe erro caso exista */}
      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          <Alert.Heading>Erro ao cadastrar acomodação</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Exibe mensagem de sucesso */}
      {success && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccess(false)}>
          <Alert.Heading>Sucesso!</Alert.Heading>
          <p>Acomodação cadastrada com sucesso.</p>
        </Alert>
      )}

      <form onSubmit={handleHotelSubmit}>
        {/* Seleção de Destino e Tipo de Quarto */}
        <div className="mb-4 bg-light p-4 rounded-3 border">
          <h5>Localização e Tipo</h5>
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Group controlId="destination">
                <Form.Label>Destino</Form.Label>
                <Form.Select
                  value={selectedDestinationId || ''}
                  onChange={(e) => setSelectedDestinationId(Number(e.target.value))}
                  disabled={loadingOptions}
                  required
                >
                  <option value="">Selecione um destino</option>
                  {destinations.map(destination => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name} ({destination.city}, {destination.country})
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Escolha o destino onde a acomodação está localizada
                </Form.Text>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group controlId="roomType">
                <Form.Label>Tipo de Quarto Padrão</Form.Label>
                <Form.Select
                  value={selectedRoomTypeId || ''}
                  onChange={(e) => setSelectedRoomTypeId(Number(e.target.value))}
                  disabled={loadingOptions}
                  required
                >
                  <option value="">Selecione um tipo de quarto</option>
                  {roomTypes.map(roomType => (
                    <option key={roomType.id} value={roomType.id}>
                      {roomType.name} (Capacidade: {roomType.totalCapacity} pessoas)
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Escolha o tipo de quarto padrão para esta acomodação
                </Form.Text>
              </Form.Group>
            </div>
          </div>
          {loadingOptions && (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" className="me-2" />
              Carregando opções...
            </div>
          )}
        </div>

        {/* Formulário da Acomodação */}
        <div className="mb-4">
          <h5>Informações do Acomodação</h5>
          <HotelForm
            hotel={hotel}
            setHotel={setHotel}
            handleSubmit={(e) => e.preventDefault()}
            handleChange={handleHotelChange}
          />
        </div>

        {/* Upload de Imagens */}
        
        <div className="mb-4">
          <h5>Imagens do Acomodação</h5>
          <ImageUpload
            images={hotelImages}
            setImages={setHotelImages}
          />
        </div>

        {/* Botões de Ação */}
        <div className="d-flex gap-2">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Cadastrando...
              </>
            ) : "Cadastrar Acomodaçãol"}
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => navigate('/admin/hotels')}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default AdminHotelRegister;
