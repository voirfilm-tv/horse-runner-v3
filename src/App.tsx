
import PrivateRoute from './routes/PrivateRoute';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

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

      
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="space-x-4">
          <a href="/profil" className="hover:underline">Profil</a>
          <a href="/historique" className="hover:underline">Historique</a>
          <a href="/amis" className="hover:underline">Amis</a>
          <a href="/partie" className="hover:underline">Partie</a>
          <a href="/plateau" className="hover:underline">Plateau</a>
          <a href="/des" className="hover:underline">Dé</a>
          <a href="/joueurs" className="hover:underline">Joueurs</a>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
        >
          Se déconnecter
        </button>
      </nav>


      <Routes>
        <Route path="/creer" element={<CreateGame />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admyn" element={<Admyn />} />
        <Route path="/Lobby" element={<Lobby />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/plateau" element={isAuthenticated ? <BoardPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
