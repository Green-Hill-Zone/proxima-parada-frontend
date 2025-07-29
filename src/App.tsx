import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Reservation from './pages/Reservation/Reservation.tsx';
import { ReservationProvider } from './pages/Reservation/context/ReservationContext.tsx';
import AdminPackageForm from './pages/Admin/AdminPackageForm';
import './App.css';

function App() {
  return (
    <ReservationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reserva" element={<Reservation />} />
          <Route path="/admin/pacotes" element={<AdminPackageForm />} />
        </Routes>
      </Router>
    </ReservationProvider>
  );
}

export default App;
