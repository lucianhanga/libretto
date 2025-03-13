import React from 'react';
import TitleSection from '../TitleSection';
import PlaceholderSection from '../PlaceholderSection';
import WebcamCaptureSection from '../WebcamCaptureSection';
import ImagePreviewSection from '../ImagePreviewSection';
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

      {!image && !capturing && <PlaceholderSection />}

      {!image && (
        <WebcamCaptureSection
          handleCapture={handleCapture}
          capturing={capturing}
          setCapturing={setCapturing}
          handleFileChange={handleFileChange}
        />
      )}

      {image && (
        <ImagePreviewSection
          image={image}
          handleRetakeClick={handleRetakeClick}
          handleSubmitClick={handleSubmitClick}
          isLoading={isLoading}
        />
      )}

      {showParsedData && fields.length > 0 && <ParsedDataDisplay fields={fields} />}

      <CSVButtons onCSVButtonClick={handleCSVButtonClick} />
    </div>
  );
};

export default AuthenticatedApp;