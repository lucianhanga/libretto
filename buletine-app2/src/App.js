import React from 'react';
import { MsalAuthenticationTemplate, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./azureAuth/authConfig";
import Authenticated from './components/Authenticated';
import NonAuthenticated from './components/NonAuthenticated';
import Header from './components/Header';
import './App.css';

const App = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div>
      <Header />
      {isAuthenticated ? (
        <MsalAuthenticationTemplate interactionType="redirect" authenticationRequest={loginRequest}>
          <Authenticated />
        </MsalAuthenticationTemplate>
      ) : (
        <NonAuthenticated />
      )}
    </div>
  );
};

export default App;
