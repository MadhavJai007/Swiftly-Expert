import logo from './logo.svg';
import './App.css';
import React, {Component, useState, useEffect, useRef, useMemo} from 'react';
import Splash from './components/Splash';
import LoginPage from './components/LoginPage';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';


const App = () => {
  const isMounted = useRef(false);
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // bool flag representing dark mode preference in browser.
  
  const theme = useMemo(() => 
    createTheme(
        {
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
            },
        }
    ),
    [prefersDarkMode],
  );

  // mimics component.onMount
  useEffect(() => {
    isMounted.current = true;
    document.title = "Swiftly";
    // startSplashTimer(1000);
  }, []);
  

  const startSplashTimer = (time) => {
    setTimeout(() => {
      setIsDoneLoading(true);
    }, time);
  }
  
  //when timer is not done loading, it will show splash screen
  // if(!isDoneLoading){
  //   return (
  //     <>
  //       <div className=""> 
  //         <Splash/>
  //       </div>
        
  //     </>
  //   )
  // }
  // else {
    // return component view that shows a login page
    return (
      <div>
        <Router>
            <AuthProvider>
              <Switch>
                <PrivateRoute exact path="/">
                  <Dashboard theme={theme}/>
                </PrivateRoute>
                <Route path="/signup">
                  <Signup theme={theme}/>
                </Route>
                <Route path="/login">
                  <Login theme={theme}/>
                </Route>
              </Switch>
            </AuthProvider>
        </Router>  
      </div>
    )
  // }
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
}

const backgroundStyle = {
  backgroundColor: '#282828',
  minHeight: "100vh",
  display: "flex"
}

export default App;
