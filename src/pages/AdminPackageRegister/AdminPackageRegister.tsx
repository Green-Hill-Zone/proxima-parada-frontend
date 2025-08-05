import React, { useState } from "react";
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PackageForm from "../Admin/components/PackageForm";

const AdminPackageRegister = () => {
  const navigate = useNavigate();

  // Pacote
  const [form, setForm] = useState({
    nome: "",
    destino: "",
    preco: "",
    descricao: "",
    dataInicio: "",
    dataFim: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Pacote cadastrado:", form);
    
    alert("Pacote cadastrado com sucesso!");
    
    // Reset do formulário
    setForm({
      nome: "",
      destino: "",
      preco: "",
      descricao: "",
      dataInicio: "",
      dataFim: ""
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
          <h5>Informações do Pacote</h5>
          <PackageForm
            form={form}
            setForm={setForm}
            handleSubmit={handlePackageSubmit}
            handleChange={handleChange}
            goToFinalize={() => {}} // Não usado nesta página
          />
        </div>

        {/* Botões de Ação */}
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            Cadastrar Pacote
          </Button>
          <Button 
            type="button" 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/dashboard')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default AdminPackageRegister;
