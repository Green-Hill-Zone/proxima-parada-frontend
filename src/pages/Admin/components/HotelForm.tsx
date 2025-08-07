import React from "react";

// Interface que corresponde à estrutura usada no componente AdminHotelRegister
type HotelFormData = {
  nome: string;
  descricao: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estrelas: string;
  preco: string;
  email: string;
  telefone: string;
  checkIn: string;
  checkOut: string;
  [key: string]: string; // Permite índice dinâmico para facilitar o handleChange
};

type Props = {
  hotel: HotelFormData;
  setHotel: (cb: React.SetStateAction<HotelFormData>) => void; // Mantido para compatibilidade
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const HotelForm: React.FC<Props> = ({
  hotel,
  // setHotel não é usado diretamente aqui, mas mantido na interface para compatibilidade
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setHotel,
  handleSubmit,
  handleChange
}) => (
  <form onSubmit={handleSubmit} className="bg-light p-4 rounded-3 border">
    <div className="mb-3">
      <label className="form-label">Nome da Acomodação</label>
      <input type="text" className="form-control" name="nome" value={hotel.nome} onChange={handleChange} required />
    </div>

    <div className="mb-3">
      <label className="form-label">Descrição</label>
      <textarea className="form-control" name="descricao" value={hotel.descricao || ""} onChange={handleChange as any} rows={3} />
    </div>

    <div className="row mb-3">
      <div className="col-md-8">
        <label className="form-label">Endereço</label>
        <input type="text" className="form-control" name="endereco" value={hotel.endereco} onChange={handleChange} required />
      </div>
      <div className="col-md-4">
        <label className="form-label">Número</label>
        <input type="text" className="form-control" name="numero" value={hotel.numero || ""} onChange={handleChange} />
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Bairro</label>
        <input type="text" className="form-control" name="bairro" value={hotel.bairro || ""} onChange={handleChange} />
      </div>
      <div className="col-md-6">
        <label className="form-label">Cidade</label>
        <input type="text" className="form-control" name="cidade" value={hotel.cidade} onChange={handleChange} required />
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-4">
        <label className="form-label">Estrelas</label>
        <input type="number" className="form-control" name="estrelas" value={hotel.estrelas} onChange={handleChange} min="1" max="5" required />
      </div>
      <div className="col-md-8">
        <label className="form-label">Preço por noite (R$)</label>
        <input type="number" className="form-control" name="preco" value={hotel.preco || ""} onChange={handleChange} min="0" step="0.01" />
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" name="email" value={hotel.email || ""} onChange={handleChange} />
      </div>
      <div className="col-md-6">
        <label className="form-label">Telefone</label>
        <input type="tel" className="form-control" name="telefone" value={hotel.telefone || ""} onChange={handleChange} />
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Check-in (hora)</label>
        <input type="time" className="form-control" name="checkIn" value={hotel.checkIn || "14:00"} onChange={handleChange} />
      </div>
      <div className="col-md-6">
        <label className="form-label">Check-out (hora)</label>
        <input type="time" className="form-control" name="checkOut" value={hotel.checkOut || "12:00"} onChange={handleChange} />
      </div>
    </div>
    {/* Botão removido */}
  </form>
);

export default HotelForm;
