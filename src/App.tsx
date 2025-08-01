import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header, ProtectedRoute, AdminRoute } from './components';
import { AuthProvider } from './contexts/AuthContext.tsx';
import AdminDashboard from './pages/AdminDashboard';
import AdminFlights from './pages/AdminFlights';
import AdminHotels from './pages/AdminHotels';
import AdminPackages from './pages/AdminPackages';
import AdminSalesReports from './pages/AdminSalesReports';
import AdminRegister from './pages/AdminRegister/index.ts';
import AdminHotelRegister from './pages/AdminHotelRegister';
import AdminFlightRegister from './pages/AdminFlightRegister';
import AdminPackageRegister from './pages/AdminPackageRegister';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPayments from './pages/MyPayments';
import MyTravels from './pages/MyTravels';
import Packages from './pages/Packages';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import { ReservationProvider } from './pages/Reservation/context/ReservationContext.tsx';
import Reservation from './pages/Reservation/Reservation.tsx';
import UserRegister from './pages/UserRegister/UserRegister';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header/>
          <Routes>
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/admin/packages" element={<AdminRoute><AdminPackages /></AdminRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/hotels" element={<AdminRoute><AdminHotels /></AdminRoute>} />
            <Route path="/admin/hotels/register" element={<AdminRoute><AdminHotelRegister /></AdminRoute>} />
            <Route path="/admin/flights" element={<AdminRoute><AdminFlights /></AdminRoute>} />
            <Route path="/admin/flights/register" element={<AdminRoute><AdminFlightRegister /></AdminRoute>} />
            <Route path="/admin/packages/register" element={<AdminRoute><AdminPackageRegister /></AdminRoute>} />
            <Route path="/admin/sales" element={<AdminRoute><AdminSalesReports /></AdminRoute>} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/reservation" element={<ReservationProvider> <Reservation /> </ReservationProvider>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-travels" element={<ProtectedRoute><MyTravels /></ProtectedRoute>} />
            <Route path="/my-payments" element={<ProtectedRoute><MyPayments /></ProtectedRoute>} />
          </Routes>
        <Footer />
      </Router>
    </AuthProvider>

  )
}

export default App