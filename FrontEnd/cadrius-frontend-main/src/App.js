// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Login from './components/pages/Login';
import Register from './components/pages/Register'; // Nova página
import Dashboard from './components/pages/Dashboard';
import Automacao from './components/pages/Automacao';
import Processos from './components/pages/Processos';
import Comunicacao from './components/pages/Comunicacao';
import Integracoes from './components/pages/Integracoes';
import Perfil from './components/pages/Perfil'; // Nova página

// Layout
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Router>
      <Routes>

        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        {/* Rotas Protegidas (Dentro do Layout) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/automacao" element={<Automacao />} />
          <Route path="/processos" element={<Processos />} />
          <Route path="/comunicacao" element={<Comunicacao />} />
          <Route path="/integracoes" element={<Integracoes />} />
          <Route path="/perfil" element={<Perfil />} /> {/* Rota do link do rodapé da Navbar */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;