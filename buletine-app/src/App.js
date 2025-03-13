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
    handleCapture,
    handleFileChange,
    handleRetake,
    handleSubmit,
    setCapturing
  } = useImageUpload(accessToken);

  const {
    status: pullingStatus,
    startPullingResult,
    fields,
    showParsedData,
    setShowParsedData
  } = useResultPulling(accessToken);

  const handleSubmitAndPull = async () => {
    const id = await handleSubmit();
    if (id) {
      startPullingResult(id);
    }
  };

  return (
    <div className="container">
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
          fields={fields}
          showParsedData={showParsedData}
          setShowParsedData={setShowParsedData}
        />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <UnauthenticatedApp login={login} />
      </UnauthenticatedTemplate>
    </div>
  );
};

export default App;
