import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchSection.css";
import {
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaPlane,
  FaUser,
} from "react-icons/fa";

const SearchBox = () => {
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestRef.current &&
        !guestRef.current.contains(event.target as Node)
      ) {
        setShowGuestOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const guestSummary = `${adults} adulto${
    adults > 1 ? "s" : ""
  } · ${children} criança${children !== 1 ? "s" : ""} · ${rooms} cômodo${
    rooms > 1 ? "s" : ""
  }`;

  // Função para realizar a busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // KISS: construir URL simples com parâmetros de busca
    const searchParams = new URLSearchParams();
    if (destination.trim()) searchParams.append('destination', destination.trim());
    if (checkInDate) searchParams.append('checkIn', checkInDate);
    if (checkOutDate) searchParams.append('checkOut', checkOutDate);
    searchParams.append('adults', adults.toString());
    searchParams.append('children', children.toString());
    searchParams.append('rooms', rooms.toString());

    // Navegar para página de resultados
    navigate(`/packages?${searchParams.toString()}`);
  };

  return (
    <div
      className="search-box mx-auto my-4 p-3 bg-white shadow rounded"
      style={{ maxWidth: "1300px", width: "100%" }}
    >
      <form onSubmit={handleSearch}>
        <div className="row g-3 align-items-end">
          {/* Destino */}
          <div className="col-12 col-md-3">
            <label className="form-label fw-bold">
              <FaPlane className="me-2" /> Para onde você vai?
            </label>
            <input
              type="text"
              placeholder="Digite o destino"
              className="form-control"
              style={{ height: "45px" }}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Datas */}
          <div className="col-12 col-md-4">
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label fw-bold mb-1">
                  <FaCalendarAlt className="me-2" /> Check-in
                </label>
                <input
                  type="date"
                  className="form-control"
                  style={{ height: "45px" }}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-bold mb-1">
                  <FaCalendarAlt className="me-2" /> Check-out
                </label>
                <input
                  type="date"
                  className="form-control"
                  style={{ height: "45px" }}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Hóspedes */}
          <div className="col-12 col-md-3 position-relative" ref={guestRef}>
            <label className="form-label fw-bold">
              <FaUser className="me-2" /> Hóspedes
            </label>
            <button
              className="form-control d-flex justify-content-between align-items-center"
              onClick={() => setShowGuestOptions(!showGuestOptions)}
              type="button"
              tabIndex={0}
              style={{ height: "45px" }}
            >
              <span>{guestSummary}</span>
              {showGuestOptions ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {showGuestOptions && (
              <div
                className="position-absolute bg-white shadow rounded p-3 mt-1 w-100"
                style={{ zIndex: 2000, maxWidth: '100%', right: 0 }}
              >
                {/* Adultos */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Adultos</span>
                  <div className="input-group w-auto">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setAdults(Math.max(adults - 1, 1))}
                      type="button"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center"
                      value={adults}
                      readOnly
                      style={{ width: "50px" }}
                    />
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setAdults(adults + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Crianças */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Crianças</span>
                  <div className="input-group w-auto">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setChildren(Math.max(children - 1, 0))}
                      type="button"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center"
                      value={children}
                      readOnly
                      style={{ width: "50px" }}
                    />
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setChildren(children + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quartos */}
                <div className="d-flex justify-content-between align-items-center">
                  <span>Quartos</span>
                  <div className="input-group w-auto">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setRooms(Math.max(rooms - 1, 1))}
                      type="button"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center"
                      value={rooms}
                      readOnly
                      style={{ width: "50px" }}
                    />
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setRooms(rooms + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão de pesquisa */}
          <div className="col-12 col-md-2 d-flex justify-content-end">
            <button 
              type="submit" 
              className="btn btn-primary w-100" 
              style={{ height: "45px", minWidth: 100 }}
            >
              Pesquisar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
