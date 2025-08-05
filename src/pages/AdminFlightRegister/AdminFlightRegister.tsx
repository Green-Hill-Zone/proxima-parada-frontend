import React, { useState } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle, PAGE_TITLES } from '../../hooks';
import CombinedFlightForm from "../Admin/components/CombinedFlightForm";

const AdminFlightRegister = () => {
  // Define o título da página
  usePageTitle(PAGE_TITLES.ADMIN_FLIGHT_REGISTER);
  const navigate = useNavigate();

  // Voo
  const [flight, setFlight] = useState({
    companhia: "",
    numero: "",
    origem: "",
    destino: "",
    data: "",
    horario: ""
  });

  // Tipo de Voo
  const [flightType, setFlightType] = useState({
    nome: "",
    descricao: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Voo cadastrado:", {
      flight,
      flightType
    });

    alert("Voo cadastrado com sucesso!");
    
    // Reset dos formulários
    setFlight({
      companhia: "",
      numero: "",
      origem: "",
      destino: "",
      data: "",
      horario: ""
    });
    setFlightType({
      nome: "",
      descricao: ""
    });
    
    // Volta para a listagem de voos
    navigate('/admin/flights');
  };

  const handleFlightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <h3>Cadastrar Novo Voo</h3>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
            ← Dashboard
          </Button>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/flights')}>
          Voltar para Voos
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <CombinedFlightForm 
          flight={flight}
          flightType={flightType}
          handleSubmit={handleSubmit}
          handleFlightChange={handleFlightChange}
          handleFlightTypeChange={handleFlightTypeChange}
        />

        {/* Botões de Ação */}
        <Row className="mt-4">
          <Col>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                Cadastrar Voo
              </Button>
              <Button 
                type="button" 
                variant="outline-secondary" 
                onClick={() => navigate('/admin/flights')}
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
