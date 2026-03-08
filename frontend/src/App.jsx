import './App.css';

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './pages/Login';
import Home from './pages/Home';
import Bets from './pages/Bets';
import Register from './pages/Register';

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/bets" element={
        <ProtectedRoute>
          <Bets />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

