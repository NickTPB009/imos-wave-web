import React from 'react';
import './App.css';
import Map from './Map'; 
import logo from './assets/logo.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="My Logo" className="App-logo" />
        <h1>IMOS</h1>
      </header>
      <main>
        <Map />
      </main>
      <footer>
        <p>I changed here. Can you see?</p>
      </footer>
    </div>
  );
}

export default App;
