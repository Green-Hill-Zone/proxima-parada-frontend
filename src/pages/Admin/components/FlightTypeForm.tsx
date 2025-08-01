import React from "react";

type Props = {
  flightType: any;
  setFlightType: (cb: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const FlightTypeForm: React.FC<Props> = ({ flightType, setFlightType, handleSubmit, handleChange }) => (
  <form onSubmit={handleSubmit} className="bg-light p-4 rounded-3 border">
    <div className="mb-3">
      <label className="form-label">Nome do Tipo de Voo</label>
      <input type="text" className="form-control" name="nome" value={flightType.nome} onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label">Descrição</label>
      <textarea className="form-control" name="descricao" value={flightType.descricao} onChange={handleChange} rows={3} required />
    </div>
    <button type="submit" className="btn w-100" style={{ background: '#3246aa', color: '#fff' }}>Cadastrar Tipo de Voo</button>
  </form>
);

export default FlightTypeForm;
