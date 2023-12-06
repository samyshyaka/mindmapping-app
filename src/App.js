// App.js
import React from 'react';
import './Styles/App.css';
import Header from './Componets/Header';
import MindMap from './Pages/MindMap';

function App() {
  return (
    <div className="App">
      <Header className="Header" />
      <MindMap />
    </div>
  );
}

export default App;
