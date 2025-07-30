import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header, ProtectedRoute } from './components';
import { AuthProvider } from './contexts/AuthContext.tsx';
import AdminPackageForm from './pages/Admin/AdminPackageForm';
import AdminRegister from './pages/AdminRegister/index.ts';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPayments from './pages/MyPayments';
import MyTravels from './pages/MyTravels';
import Pacotes from './pages/Pacotes';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import { ReservationProvider } from './pages/Reservation/context/ReservationContext.tsx';
import Reservation from './pages/Reservation/Reservation.tsx';
import UserRegister from './pages/UserRegister/UserRegister';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Container>
          <Routes>
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/admin/packages" element={<AdminPackageForm />} />
            <Route path="/pacotes" element={<Pacotes />} />
            <Route path="/reservation" element={<ReservationProvider> <Reservation /> </ReservationProvider>} />
            <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
            <Route path="/my-travels" element={<ProtectedRoute> <MyTravels /> </ProtectedRoute>} />
            <Route path="/my-payments" element={<ProtectedRoute> <MyPayments /> </ProtectedRoute>} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </AuthProvider>

  )
}

export default App