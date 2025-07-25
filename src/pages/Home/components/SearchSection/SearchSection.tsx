import { useState, useRef, useEffect } from "react";
import {
  FaPlane,
  FaCalendarAlt,
  FaUser,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const SearchBox = () => {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="search-box mx-auto my-4 p-3 bg-white shadow rounded"
      style={{ maxWidth: "1100px" }}
    >
      <div className="row g-2 align-items-end">
        {/* Destino */}
        <div className="col-md-3">
          <label className="form-label fw-bold">
            <FaPlane className="me-2" /> Para onde você vai?
          </label>
          <input
            type="text"
            placeholder="Digite o destino"
            className="form-control"
            style={{ height: "45px" }}
          />
        </div>

        {/* Datas */}
        <div className="col-md-4">
          <div className="d-flex align-items-end gap-2">
            <div className="flex-grow-1">
              <label className="form-label fw-bold mb-1">
                <FaCalendarAlt className="me-2" /> Check-in
              </label>
              <input
                type="date"
                className="form-control"
                style={{ height: "45px" }}
              />
            </div>
            <div className="flex-grow-1">
              <label className="form-label fw-bold mb-1">
                <FaCalendarAlt className="me-2" /> Check-out
              </label>
              <input
                type="date"
                className="form-control"
                style={{ height: "45px" }}
              />
            </div>
          </div>
        </div>

        {/* Hóspedes */}
        <div className="col-md-4 position-relative" ref={guestRef}>
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
              style={{ zIndex: 999 }}
            >
              {/* Adultos */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Adultos</span>
                <div className="input-group w-auto">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setAdults(Math.max(adults - 1, 1))}
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
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botão de pesquisa */}
        <div className="col-md-1 d-grid align-self-end">
          <button className="btn btn-primary" style={{ height: "45px" }}>
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
