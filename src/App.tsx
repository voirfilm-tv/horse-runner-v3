import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Lobby from '@/pages/Lobby';
import Game from '@/pages/Game';
import CreateGamePage from '@/pages/CreateGamePage';
import History from '@/pages/History';
import Friends from '@/pages/Friends';
import PrivateRoute from '@/routes/PrivateRoute';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<PrivateRoute><CreateGamePage /></PrivateRoute>} />
          <Route path="/lobby" element={<PrivateRoute><Lobby /></PrivateRoute>} />
          <Route path="/game/:id" element={<PrivateRoute><Game /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/friends" element={<PrivateRoute><Friends /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}