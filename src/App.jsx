import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SongListPage from './pages/SongListPage';
import SongDetailsPage from './pages/SongDetailsPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Lyrics App</h1>
      <Routes>
        <Route path="/" element={<Navigate to="/songs" replace />} />
        <Route path="/songs" element={<SongListPage />} />
        <Route path="/songs/:songId" element={<SongDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;