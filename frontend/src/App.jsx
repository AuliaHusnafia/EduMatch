import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import MenteeDashboard from './pages/MenteeDashboard';

function App() {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  console.log('App.jsx - Role:', role);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - Admin */}
        <Route 
          path="/admin" 
          element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        
        {/* Protected Routes - Mentor */}
        <Route 
          path="/mentor" 
          element={token && role === 'mentor' ? <MentorDashboard /> : <Navigate to="/login" />} 
        />
        
        {/* Protected Routes - Mentee */}
        <Route 
          path="/mentee" 
          element={token && role === 'mentee' ? <MenteeDashboard /> : <Navigate to="/login" />} 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;