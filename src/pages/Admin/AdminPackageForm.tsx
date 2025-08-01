
import React, { useState } from "react";
import PackageForm from "./components/PackageForm";
import FlightForm from "./components/FlightForm";
import HotelForm from "./components/HotelForm";
import RoomTypeForm from "./components/RoomTypeForm";
import FlightTypeForm from "./components/FlightTypeForm";
import ImageUpload from "./components/ImageUpload";
import PackageSummary from "./components/PackageSummary";

const TABS = [
    { key: "voo", label: "Voo" },
    { key: "hotel", label: "Hotel" },
    { key: "pacote", label: "Pacote" },
    { key: "finalizar", label: "Finalizar" },
];

const AdminPackageForm = () => {
  const [activeTab, setActiveTab] = useState("pacote");

  // Pacote
  const [form, setForm] = useState({
    nome: "",
    destino: "",
    preco: "",
    descricao: "",
    dataInicio: "",
    dataFim: ""
  });

  // Voo
  const [flight, setFlight] = useState({
    companhia: "",
    numero: "",
    origem: "",
    destino: "",
    data: "",
    horario: ""
  });

  // Hotel
  const [hotel, setHotel] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    estrelas: ""
  });

  // Tipo de Quarto
  const [roomType, setRoomType] = useState({
    nome: "",
    capacidade: "",
    preco: ""
  });

  // Tipo de Voo
  const [flightType, setFlightType] = useState({
    nome: "",
    descricao: ""
  });

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: any) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submits
  // Para cada submit, simula salvar as imagens e obter URLs do backend
  // Apenas imagens do hotel
  const [hotelImages, setHotelImages] = useState<File[]>([]);

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro de pacote realizado com sucesso!\n" + JSON.stringify(form, null, 2));
    setForm({ nome: "", destino: "", preco: "", descricao: "", dataInicio: "", dataFim: "" });
  };
  const handleFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro de voo realizado com sucesso!\n" + JSON.stringify(flight, null, 2));
    setFlight({ companhia: "", numero: "", origem: "", destino: "", data: "", horario: "" });
  };
  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", hotel.nome);
    formData.append("endereco", hotel.endereco);
    formData.append("cidade", hotel.cidade);
    formData.append("estrelas", hotel.estrelas);
    hotelImages.forEach((file) => {
      formData.append("imagens", file);
    });
    // Exemplo de envio para backend:
    // await fetch("/api/hoteis", { method: "POST", body: formData });
    alert("Cadastro de hotel enviado! (simulação)\n" + Array.from(formData.entries()).map(([k,v]) => `${k}: ${v instanceof File ? v.name : v}`).join("\n"));
    setHotel({ nome: "", endereco: "", cidade: "", estrelas: "" });
    setHotelImages([]);
  };
  const handleRoomTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro de tipo de quarto realizado com sucesso!\n" + JSON.stringify(roomType, null, 2));
    setRoomType({ nome: "", capacidade: "", preco: "" });
  };
  const handleFlightTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro de tipo de voo realizado com sucesso!\n" + JSON.stringify(flightType, null, 2));
    setFlightType({ nome: "", descricao: "" });
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Administração de Cadastros</h3>
      <ul className="nav nav-tabs mb-3">
        {TABS.map(tab => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link${activeTab === tab.key ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {activeTab === "pacote" && (
        <>
          <PackageForm
            form={form}
            setForm={setForm}
            handleSubmit={e => e.preventDefault()}
            handleChange={e => handleChange(e, setForm)}
            goToFinalize={() => setActiveTab("finalizar")}
          />
        </>
      )}
      {activeTab === "finalizar" && (
        <PackageSummary
          form={form}
          flight={flight}
          flightType={flightType}
          hotel={hotel}
          roomType={roomType}
          hotelImages={hotelImages}
          onFinalize={() => handlePackageSubmit({ preventDefault: () => {} } as React.FormEvent)}
          // Botão de salvar removido
        />
      )}
      {activeTab === "voo" && (
        <>
          <FlightForm
            flight={flight}
            setFlight={setFlight}
            handleSubmit={e => e.preventDefault()}
            handleChange={e => handleChange(e, setFlight)}
          />
          <div className="mt-4">
            <h5>Cadastro de Tipo de Voo</h5>
            <FlightTypeForm
              flightType={flightType}
              setFlightType={setFlightType}
              handleSubmit={e => e.preventDefault()}
              handleChange={e => handleChange(e, setFlightType)}
            />
          </div>
          <button className="btn btn-primary mt-3" type="button" onClick={() => setActiveTab("hotel")}>Próxima etapa</button>
        </>
      )}
      {activeTab === "hotel" && (
        <>
          <HotelForm
            hotel={hotel}
            setHotel={setHotel}
            handleSubmit={e => e.preventDefault()}
            handleChange={e => handleChange(e, setHotel)}
          />
          <ImageUpload label="Fotos do Hotel" images={hotelImages} setImages={setHotelImages} />
          <div className="mt-4">
            <h5>Cadastro de Tipo de Quarto</h5>
            <RoomTypeForm
              roomType={roomType}
              setRoomType={setRoomType}
              handleSubmit={e => e.preventDefault()}
              handleChange={e => handleChange(e, setRoomType)}
            />
          </div>
          <button className="btn btn-primary mt-3" type="button" onClick={() => setActiveTab("pacote")}>Próxima etapa</button>
        </>
      )}
    </div>
  );
};

export default AdminPackageForm;
