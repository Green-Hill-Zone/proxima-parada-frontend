import React from "react";

type Props = {
  hotel: any;
  setHotel: (cb: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelForm: React.FC<Props> = ({ hotel, setHotel, handleSubmit, handleChange }) => (
  <form onSubmit={handleSubmit} className="bg-light p-4 rounded-3 border">
    <div className="mb-3">
      <label className="form-label">Nome do Hotel</label>
      <input type="text" className="form-control" name="nome" value={hotel.nome} onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label">Endereço</label>
      <input type="text" className="form-control" name="endereco" value={hotel.endereco} onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label">Cidade</label>
      <input type="text" className="form-control" name="cidade" value={hotel.cidade} onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label">Estrelas</label>
      <input type="number" className="form-control" name="estrelas" value={hotel.estrelas} onChange={handleChange} min="1" max="5" required />
    </div>
    {/* Botão removido */}
  </form>
);

export default HotelForm;
