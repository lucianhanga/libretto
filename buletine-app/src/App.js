import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import useAuth from './hooks/useAuth';
import useImageUpload from './hooks/useImageUpload';
import useResultPulling from './hooks/useResultPulling';
import AuthenticatedApp from './components/AuthenticatedApp';
import UnauthenticatedApp from './components/UnauthenticatedApp';
import './App.css';

const App = () => {
  const { accessToken, login } = useAuth();
  const {
    image,
    capturing,
    isLoading,
    status: uploadStatus,
    progress: uploadProgress,
    progressLabel: uploadProgressLabel,
    handleCapture,
    handleFileChange,
    handleRetake,
    handleSubmit,
    setCapturing
  } = useImageUpload(accessToken);

  const {
    status: pullingStatus,
    progress: pullingProgress,
    progressLabel: pullingProgressLabel,
    startPullingResult
  } = useResultPulling(accessToken);

  const handleSubmitAndPull = async () => {
    const id = await handleSubmit();
    if (id) {
      startPullingResult(id);
    }
  };

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
          handleSubmit={handleSubmitAndPull}
          setCapturing={setCapturing}
          isLoading={isLoading}
          status={uploadStatus || pullingStatus}
          progress={uploadProgress || pullingProgress}
          progressLabel={uploadProgressLabel || pullingProgressLabel}
        />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <UnauthenticatedApp login={login} />
      </UnauthenticatedTemplate>
    </div>
  );
};

export default App;
