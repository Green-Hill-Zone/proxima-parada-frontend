import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header, ProtectedRoute } from './components';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPayments from './pages/MyPayments';
import MyTravels from './pages/MyTravels';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import UserRegister from './pages/UserRegister/UserRegister';
import Reservation from './pages/Reservation/Reservation.tsx';
import AdminPackageForm from './pages/Admin/AdminPackageForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/payment" element={<Payment />} />
         <Route path="/reserva" element={<Reservation />} />
          <Route path="/admin/pacotes" element={<AdminPackageForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-travels"
            element={
              <ProtectedRoute>
                <MyTravels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-payments"
            element={
              <ProtectedRoute>
                <MyPayments />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
