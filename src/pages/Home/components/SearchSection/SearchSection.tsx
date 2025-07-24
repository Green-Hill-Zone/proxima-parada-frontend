import { useState } from 'react';
import { FaBed, FaCalendarAlt, FaUser } from 'react-icons/fa';

const SearchBox = () => {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  return (
    <div className="search-box mx-auto my-4 p-3 bg-white shadow rounded" style={{ maxWidth: '1100px' }}>
      <div className="row g-2 align-items-center">

        {/* Destino */}
        <div className="col-md-3">
          <label className="form-label fw-bold"><FaBed className="me-2" /> Para onde você vai?</label>
          <input type="text" placeholder="Digite o destino" className="form-control" />
        </div>

        {/* Datas */}
        <div className="col-md-4">
          <label className="form-label fw-bold"><FaCalendarAlt className="me-2" /> Datas</label>
          <div className="d-flex align-items-center gap-2">
            <input type="date" className="form-control" />
            <span>—</span>
            <input type="date" className="form-control" />
          </div>
        </div>

        {/* Hóspedes */}
        <div className="col-md-4">
          <label className="form-label fw-bold"><FaUser className="me-2" /> Hóspedes</label>
          <div className="d-flex flex-wrap gap-3">

            {/* Adultos */}
            <div className="d-flex align-items-center gap-1">
              <span>Adultos:</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setAdults(Math.max(adults - 1, 0))}>-</button>
              <span>{adults}</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setAdults(adults + 1)}>+</button>
            </div>

            {/* Crianças */}
            <div className="d-flex align-items-center gap-1">
              <span>Crianças:</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setChildren(Math.max(children - 1, 0))}>-</button>
              <span>{children}</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setChildren(children + 1)}>+</button>
            </div>

            {/* Quartos */}
            <div className="d-flex align-items-center gap-1">
              <span>Quartos:</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setRooms(Math.max(rooms - 1, 1))}>-</button>
              <span>{rooms}</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setRooms(rooms + 1)}>+</button>
            </div>
          </div>
        </div>

        {/* Botão de pesquisa */}
        <div className="col-md-1 d-grid">
          <button className="btn btn-primary mt-4">Pesquisar</button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
