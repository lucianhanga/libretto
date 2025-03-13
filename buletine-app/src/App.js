import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import useAuth from './hooks/useAuth';
import useImageUpload from './hooks/useImageUpload';
import AuthenticatedApp from './components/AuthenticatedApp';
import UnauthenticatedApp from './components/UnauthenticatedApp';
import './App.css';

const App = () => {
  const { accessToken, login } = useAuth();
  const {
    image,
    capturing,
    isLoading,
    status,
    progress,
    progressLabel,
    handleCapture,
    handleFileChange,
    handleRetake,
    handleSubmit,
    setCapturing
  } = useImageUpload(accessToken);

  return (
    <div className="container">
      <h1>React Webcam Capture</h1>
      <AuthenticatedTemplate>
        <AuthenticatedApp
          image={image}
          capturing={capturing}
          handleCapture={handleCapture}
          handleFileChange={handleFileChange}
          handleRetake={handleRetake}
          handleSubmit={handleSubmit}
          setCapturing={setCapturing}
          isLoading={isLoading}
          status={status}
          progress={progress}
          progressLabel={progressLabel}
        />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <UnauthenticatedApp login={login} />
      </UnauthenticatedTemplate>
    </div>
  );
};

export default App;
