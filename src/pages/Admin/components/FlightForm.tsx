import React from "react";

type Props = {
  flight: any;
  setFlight: (cb: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FlightForm: React.FC<Props> = ({ flight, setFlight, handleSubmit, handleChange }) => (
  <form onSubmit={handleSubmit} className="bg-light p-4 rounded-3 border">
    <div className="mb-3">
      <label className="form-label">Companhia Aérea</label>
      <input type="text" className="form-control" name="companhia" value={flight.companhia} onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label">Número do Voo</label>
      <input type="text" className="form-control" name="numero" value={flight.numero} onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label">Origem</label>
      <input type="text" className="form-control" name="origem" value={flight.origem} onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label">Destino</label>
      <input type="text" className="form-control" name="destino" value={flight.destino} onChange={handleChange} required />
    </div>
    <div className="row mb-3">
      <div className="col">
        <label className="form-label">Data</label>
        <input type="date" className="form-control" name="data" value={flight.data} onChange={handleChange} required />
      </div>
      <div className="col">
        <label className="form-label">Horário</label>
        <input type="time" className="form-control" name="horario" value={flight.horario} onChange={handleChange} required />
      </div>
    </div>
    <button type="submit" className="btn w-100" style={{ background: '#3246aa', color: '#fff' }}>Cadastrar Voo</button>
  </form>
);

export default FlightForm;
