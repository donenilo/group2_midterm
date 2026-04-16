import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import SearchBar from './components/SearchBar';
import SongList from './components/SongList';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <h1>Lyrics App</h1>
        <SearchBar />
        <SongList />
      </div>
    </Provider>
  );
}

export default App;