import React, { useState } from "react";
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PackageFormAdvanced from "../Admin/components/PackageFormAdvanced";

const AdminPackageRegister = () => {
  const navigate = useNavigate();

  // Pacote com campos adicionais para hotel e voos
  const [form, setForm] = useState({
    nome: "",
    destino: "",
    preco: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    hotelId: undefined as number | undefined,
    vooDaId: undefined as number | undefined,
    vooVoltaId: undefined as number | undefined
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Para campos de ID, converter para number ou undefined
    if (name === 'hotelId' || name === 'vooDaId' || name === 'vooVoltaId') {
      setForm(prev => ({
        ...prev,
        [name]: value ? Number(value) : undefined
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Pacote completo cadastrado:", form);
    
    // Validação básica
    if (!form.hotelId) {
      alert("Por favor, selecione uma acomodação para o pacote.");
      return;
    }
    
    if (!form.vooDaId) {
      alert("Por favor, selecione pelo menos o voo de ida.");
      return;
    }
    
    alert("Pacote cadastrado com sucesso! Incluindo hotel e voos selecionados.");
    
    // Reset do formulário
    setForm({
      nome: "",
      destino: "",
      preco: "",
      descricao: "",
      dataInicio: "",
      dataFim: "",
      hotelId: undefined,
      vooDaId: undefined,
      vooVoltaId: undefined
    });
    
    // Volta para a listagem de pacotes (ou dashboard)
    navigate('/admin/dashboard');
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

      <form onSubmit={handlePackageSubmit}>
        {/* Formulário do Pacote */}
        <div className="mb-4">
          <h5>Configuração Completa do Pacote</h5>
          <PackageFormAdvanced
            form={form}
            handleSubmit={handlePackageSubmit}
            handleChange={handleChange}
            goToFinalize={() => {}} // Não usado nesta página
          />
        </div>
      </form>
    </Container>
  );
};

export default AdminPackageRegister;
