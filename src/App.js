import logo from './logo.svg';
import './App.css';
import React, {Component, useState, useEffect, useRef} from 'react';


const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Make <code>src/App.js</code> the splash screen (shows Swiftly logo and stuff).
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
