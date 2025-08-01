import React from "react";

type Props = {
  form: any;
  flight: any;
  flightType: any;
  hotel: any;
  roomType: any;
  hotelImages: File[];
  onFinalize: () => void;
};

const PackageSummary: React.FC<Props> = ({ form, flight, flightType, hotel, roomType, hotelImages, onFinalize }) => (
  <div className="bg-light p-4 rounded-3 border">
    <h4 className="mb-3">Resumo do Cadastro</h4>
    <div className="mb-3">
      <strong>Pacote:</strong>
      <ul>
        <li>Nome: {form.nome}</li>
        <li>Destino: {form.destino}</li>
        <li>Preço: {form.preco}</li>
        <li>Descrição: {form.descricao}</li>
        <li>Data Início: {form.dataInicio}</li>
        <li>Data Fim: {form.dataFim}</li>
      </ul>
    </div>
    <div className="mb-3">
      <strong>Voo:</strong>
      <ul>
        <li>Companhia: {flight.companhia}</li>
        <li>Número: {flight.numero}</li>
        <li>Origem: {flight.origem}</li>
        <li>Destino: {flight.destino}</li>
        <li>Data: {flight.data}</li>
        <li>Horário: {flight.horario}</li>
        <li>Tipo: {flightType.nome} - {flightType.descricao}</li>
      </ul>
    </div>
    <div className="mb-3">
      <strong>Hotel:</strong>
      <ul>
        <li>Nome: {hotel.nome}</li>
        <li>Endereço: {hotel.endereco}</li>
        <li>Cidade: {hotel.cidade}</li>
        <li>Estrelas: {hotel.estrelas}</li>
        <li>Tipo de Quarto: {roomType.nome} (Capacidade: {roomType.capacidade}, Preço: {roomType.preco})</li>
        <li>Imagens: {hotelImages.length > 0 ? hotelImages.map(img => img.name).join(", ") : "Nenhuma"}</li>
      </ul>
    </div>
    <button
      className="btn btn-success w-100 mb-2"
      type="button"
      onClick={async () => {
        const payload = {
          pacote: form,
          voo: flight,
          tipoVoo: flightType,
          hotel,
          tipoQuarto: roomType,
          imagens: hotelImages.map(img => img.name)
        };
        try {
          const response = await fetch("/api/pacotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            alert("Cadastro realizado com sucesso!");
            onFinalize();
          } else {
            alert("Erro ao salvar no banco de dados.");
          }
        } catch (err) {
          alert("Erro de conexão com o banco de dados.");
        }
      }}
    >
      Finalizar Cadastro
    </button>
  </div>
);

export default PackageSummary;
