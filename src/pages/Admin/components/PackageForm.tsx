import React from "react";

type Props = {
  form: any;
  setForm: (cb: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const PackageForm: React.FC<Props> = ({ form, setForm, handleSubmit, handleChange }) => (
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
    <button type="submit" className="btn w-100" style={{ background: '#3246aa', color: '#fff' }}>Cadastrar Pacote</button>
  </form>
);

export default PackageForm;
