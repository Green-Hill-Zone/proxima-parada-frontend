import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header, ProtectedRoute } from './components';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import MyTravels from './pages/MyTravels';
import Profile from './pages/Profile';
import Payment from './pages/Payment';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/payment" element={<Payment/>} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
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
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
