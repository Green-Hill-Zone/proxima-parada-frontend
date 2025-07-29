import React, { useState } from "react";

const AdminPackageForm = () => {
  const [form, setForm] = useState({
    nome: "",
    destino: "",
    preco: "",
    descricao: "",
    dataInicio: "",
    dataFim: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode enviar os dados para a API ou salvar localmente
    alert("Pacote cadastrado com sucesso!\n" + JSON.stringify(form, null, 2));
    setForm({ nome: "", destino: "", preco: "", descricao: "", dataInicio: "", dataFim: "" });
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Cadastro de Pacote de Viagem</h3>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded-3 border">
        <div className="mb-3">
          <label className="form-label">Nome do Pacote</label>
          <input type="text" className="form-control" name="nome" value={form.nome} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Destino</label>
          <input type="text" className="form-control" name="destino" value={form.destino} onChange={handleChange} required />
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
        <button type="submit" className="btn btn-primary w-100">Cadastrar Pacote</button>
      </form>
    </div>
  );
};

export default AdminPackageForm;
