import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header, ProtectedRoute } from './components';
import { AuthProvider } from './contexts/AuthContext.tsx';
import AdminRegister from './pages/AdminRegister';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPayments from './pages/MyPayments';
import MyTravels from './pages/MyTravels';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import UserRegister from './pages/UserRegister/UserRegister';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota administrativa sem Header/Footer */}
          <Route path="/admin-register" element={<AdminRegister />} />
          
          {/* Rotas normais com Header/Footer */}
          <Route path="/*" element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/payment" element={<Payment />} />
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
            </>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
