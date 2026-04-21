import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SongListPage from './pages/SongListPage';
import SongDetailsPage from './pages/SongDetailsPage';
import ArtistPage from './pages/ArtistPage';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Shared header shown across all pages. */}
      <Header />

      {/* Route table for the app's main pages. */}
      <Routes>
        {/* Redirect base URL to the song list as the default landing page. */}
        <Route path="/" element={<Navigate to="/songs" replace />} />
        <Route path="/songs" element={<SongListPage />} />
        <Route path="/songs/:songId" element={<SongDetailsPage />} />
        <Route path="/artists/:artistId" element={<ArtistPage />} />
      </Routes>
    </div>
  );
}

export default App;