import logo from './logo.svg';
import './App.css';
import React, {Component, useState, useEffect, useRef, useMemo} from 'react';
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import BrowseChaptersView from './components/BrowseChapters';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// main app component
const App = () => {
  const isMounted = useRef(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // bool flag representing dark mode preference in browser.
  
  // creates theme based on darkmode variable
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

  // mimics component.onMount and mounts the component when rendered
  useEffect(() => {
    isMounted.current = true;
    document.title = "Swiftly";
  }, []);
  
    return (
      <div>
        {/* Router used as index for navigation */}
        <Router>
            {/* Authprovider wrapper used to authentication */}
            <AuthProvider> 
              <Switch>
                <PrivateRoute exact path="/">
                  <Dashboard theme={theme}/> {/*dashboard componenet*/}
                </PrivateRoute>
                <PrivateRoute exact path='/browse' >
                  <BrowseChaptersView theme={theme} /> {/* browse chapters view component */}
                </PrivateRoute>
                <Route path="/signup">
                  <SignupView theme={theme}/> {/* signup page view */}
                </Route>
                <Route path="/login">
                   <LoginView theme={theme}/> {/* login page view */}
                </Route>
              </Switch>
            </AuthProvider>
        </Router>  
      </div>
    )
}

const backgroundStyle = {
  backgroundColor: '#282828',
  minHeight: "100vh",
  display: "flex"
}

export default App;
