import React, { useState } from "react";
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HotelForm from "../Admin/components/HotelForm";
import RoomTypeForm from "../Admin/components/RoomTypeForm";
import ImageUpload from "../Admin/components/ImageUpload";

const AdminHotelRegister = () => {
  const navigate = useNavigate();

  // Hotel
  const [hotel, setHotel] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    estrelas: ""
  });

  // Tipo de Quarto
  const [roomType, setRoomType] = useState({
    nome: "",
    capacidade: "",
    preco: ""
  });

  // Imagens do hotel
  const [hotelImages, setHotelImages] = useState<File[]>([]);

  // Handlers
  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHotel(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRoomType(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", hotel.nome);
    formData.append("endereco", hotel.endereco);
    formData.append("cidade", hotel.cidade);
    formData.append("estrelas", hotel.estrelas);
    
    // Adiciona dados do tipo de quarto
    formData.append("roomType", JSON.stringify(roomType));
    
    // Adiciona imagens
    hotelImages.forEach((file) => {
      formData.append("imagens", file);
    });

    // Simulação de envio para backend
    console.log("Hotel cadastrado:", {
      hotel,
      roomType,
      images: hotelImages.map(file => file.name)
    });

    alert("Hotel cadastrado com sucesso!");
    
    // Reset dos formulários
    setHotel({ nome: "", endereco: "", cidade: "", estrelas: "" });
    setRoomType({ nome: "", capacidade: "", preco: "" });
    setHotelImages([]);
    
    // Volta para a listagem de hotéis
    navigate('/admin/hotels');
  };

  const handleRoomTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tipo de quarto cadastrado:", roomType);
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <h3>Cadastrar Novo Hotel</h3>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
            ← Dashboard
          </Button>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/hotels')}>
          Voltar para Hotéis
        </Button>
      </div>

      <form onSubmit={handleHotelSubmit}>
        {/* Formulário do Hotel */}
        <div className="mb-4">
          <h5>Informações do Hotel</h5>
          <HotelForm
            hotel={hotel}
            setHotel={setHotel}
            handleSubmit={(e) => e.preventDefault()}
            handleChange={handleHotelChange}
          />
        </div>

        {/* Upload de Imagens */}
        <div className="mb-4">
          <ImageUpload 
            label="Fotos do Hotel" 
            images={hotelImages} 
            setImages={setHotelImages} 
          />
        </div>

        {/* Tipo de Quarto */}
        <div className="mb-4">
          <h5>Tipo de Quarto</h5>
          <RoomTypeForm
            roomType={roomType}
            setRoomType={setRoomType}
            handleSubmit={handleRoomTypeSubmit}
            handleChange={handleRoomTypeChange}
          />
        </div>

        {/* Botões de Ação */}
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            Cadastrar Hotel
          </Button>
          <Button 
            type="button" 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/hotels')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default AdminHotelRegister;
