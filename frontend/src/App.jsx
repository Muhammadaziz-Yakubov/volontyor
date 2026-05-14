import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Volunteers from './pages/Volunteers';
import Events from './pages/Events';
import Attendance from './pages/Attendance';
import Statistics from './pages/Statistics';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/events" element={<Events />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/statistics" element={<Statistics />} />
          </Route>
        </Routes>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#111827',
            color: '#F8FAFC',
            border: '1px solid #1e293b',
          }
        }} />
      </Router>
    </AuthProvider>
  );
}

export default App;
