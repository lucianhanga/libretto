import React from 'react';
import './UnauthenticatedApp.css';

const UnauthenticatedApp = ({ login }) => {
  return (
    <div>
      <p>You need to sign in to use the app.</p>
      <button onClick={() => login()}>Sign In</button>
    </div>
  );
};

export default UnauthenticatedApp;
