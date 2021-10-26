import logo from './logo.svg';
import './App.css';
import React, {Component, useState, useEffect, useRef} from 'react';


const App = () => {

  // mimics component.onMount
  useEffect(() => {
    document.title = "Swiftly";
  });


  return (
    <>
    
    </>
    // <div className="App" > 
    //   <div className="bg-purple-600 bg-opacity-100">

    //   </div>
    //   {/* <h1 className="text-red-500">Heyyyyy</h1> */}
    //   {/* <header className="App-header"> */}
    //   {/* <header style={backgroundStyle}>
        
    //     <p className="text-red-500">
    //       Make <code>src/App.js</code> the splash screen (shows Swiftly logo and stuff).
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header> */}
    // </div>
  );
}

const backgroundStyle = {
  backgroundColor: '#282828',
  minHeight: "100vh",
  display: "flex"
}

export default App;
