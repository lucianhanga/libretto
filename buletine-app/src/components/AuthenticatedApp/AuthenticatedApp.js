import React from 'react';
import TitleSection from '../TitleSection';
import CaptureSection from '../CaptureSection';
import CSVButtons from '../CSVButtons';
import ParsedDataDisplay from '../ParsedDataDisplay';
import './AuthenticatedApp.css';

const AuthenticatedApp = ({ image, capturing, handleCapture, handleFileChange, handleRetake, handleSubmit, setCapturing, isLoading, status, fields, showParsedData, setShowParsedData }) => {
  const handleRetakeClick = () => {
    handleRetake();
    setShowParsedData(false);
  };

  const handleSubmitClick = async () => {
    await handleSubmit();
    setShowParsedData(false);
  };

  const handleCSVButtonClick = () => {
    setShowParsedData(false);
  };

  return (
    <div className="authenticated-app">
      <TitleSection />

      <CaptureSection
        image={image}
        capturing={capturing}
        handleCapture={handleCapture}
        handleFileChange={handleFileChange}
        handleRetakeClick={handleRetakeClick}
        handleSubmitClick={handleSubmitClick}
        setCapturing={setCapturing}
        isLoading={isLoading}
      />

      {showParsedData && fields.length > 0 && <ParsedDataDisplay fields={fields} />}

      <CSVButtons onCSVButtonClick={handleCSVButtonClick} />
    </div>
  );
};

export default AuthenticatedApp;