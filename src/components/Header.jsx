import React from 'react';
import { Link } from 'react-router-dom';
import GeniusConnect from './GeniusConnect';

function Header() {
  return (
    <header className="main-header">
      <Link to="/songs" className="logo-container">
        <h2 className="logo-text">Lyricist</h2>
      </Link>
      <GeniusConnect />
    </header>
  );
}

export default Header;
