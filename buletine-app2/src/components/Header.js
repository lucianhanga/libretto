import React from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../azureAuth/authConfig";
import './Header.css';

const Header = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <div className="header">
      {isAuthenticated ? (
        <button className="auth-button" onClick={handleLogout}>Logout</button>
      ) : (
        <button className="auth-button" onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default Header;