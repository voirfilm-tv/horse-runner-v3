
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GameBoard from './components/GameBoard/GameBoard';
import CreateGame from './pages/CreateGame';
import Admyn from './pages/Admyn';
import Lobby from './pages/Lobby';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('🧪 Vérification userId localStorage:', userId);
    setIsAuthenticated(!!userId);
    console.log('🔐 Auth check:', !!userId);
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <Router>
      <Routes>
        <Route path="/creer" element={<CreateGame />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admyn" element={<Admyn />} />
        <Route path="/Lobby" element={<Lobby />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/game" element={isAuthenticated ? <GameBoard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
