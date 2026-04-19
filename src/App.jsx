import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SongListPage from './pages/SongListPage';
import SongDetailsPage from './pages/SongDetailsPage';
import ArtistPage from './pages/ArtistPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to="/songs" replace />} />
        <Route path="/songs" element={<SongListPage />} />
        <Route path="/songs/:songId" element={<SongDetailsPage />} />
        <Route path="/artists/:artistId" element={<ArtistPage />} />
      </Routes>
    </div>
  );
}

export default App;