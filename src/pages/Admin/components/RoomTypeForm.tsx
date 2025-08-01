import React from "react";

type Props = {
  roomType: any;
  setRoomType: (cb: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const RoomTypeForm: React.FC<Props> = ({ roomType, setRoomType, handleSubmit, handleChange }) => (
  <form onSubmit={handleSubmit} className="bg-light p-4 rounded-3 border">
    <div className="mb-3">
      <label className="form-label">Nome do Tipo de Quarto</label>
      <input type="text" className="form-control" name="nome" value={roomType.nome} onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label">Capacidade</label>
      <input type="number" className="form-control" name="capacidade" value={roomType.capacidade} onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label">Preço</label>
      <input type="number" className="form-control" name="preco" value={roomType.preco} onChange={handleChange} required />
    </div>
    <button type="submit" className="btn w-100" style={{ background: '#3246aa', color: '#fff' }}>Cadastrar Tipo de Quarto</button>
  </form>
);

export default RoomTypeForm;
