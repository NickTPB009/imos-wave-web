import React from 'react';
import './App.css';
import Map from './Map'; 
import logo from './assets/logo.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="My Logo" className="App-logo" />
        <h1>IMOS Wave Data</h1>
      </header>

      <div id='map-container'><main>
        <Map />
      </main>
      <footer>
        <p></p>
      </footer>
      </div>
      
    </div>
  );
}

export default App;
