import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Cases from './Pages/Cases';
import Autism from './Pages/Autism';
import About from './Pages/About';
import Profile from './Pages/Profile';
import ChangePassword from './Pages/ChangePassword';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminDashboard from './Pages/AdminDashboard';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ForgotPassword from './Pages/ForgotPassword';
import Game from './Pages/Game';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container" style={{ padding: '3rem 0' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.is_admin) return <Navigate to="/" replace />;
  return children;
}

function AppBody() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cases" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
        <Route path="/autism" element={<Autism />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/play" element={<ProtectedRoute><Game /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>

        <LanguageProvider>

        <AppBody />
        
        </LanguageProvider>

    </AuthProvider>
  );
}

export default App;
