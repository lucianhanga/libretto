import React, { useState } from 'react';
import TitleSection from '../TitleSection';
import CaptureSection from '../CaptureSection';
import PullResultSection from '../PullResultSection';
import CSVButtons from '../CSVButtons';
import ParsedDataDisplay from '../ParsedDataDisplay';
import './AuthenticatedApp.css';

const AuthenticatedApp = ({ image, capturing, handleCapture, handleFileChange, handleRetake, handleSubmit, setCapturing, isLoading, status, fields, showParsedData, setShowParsedData }) => {
  const [showPullResult, setShowPullResult] = useState(false);

  const handleRetakeClick = () => {
    handleRetake();
    setShowParsedData(false);
    setShowPullResult(false);
  };

  const handleSubmitClick = async () => {
    await handleSubmit();
    setShowParsedData(false);
    setShowPullResult(true);
  };

  const handleCSVButtonClick = () => {
    setShowParsedData(false);
  };

  return (
    <div className="authenticated-app">
      <TitleSection />

      {!showPullResult && (
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
      )}

      {showPullResult && (
        <PullResultSection
          image={image}
        />
      )}

      {showParsedData && fields.length > 0 && <ParsedDataDisplay fields={fields} />}

      <CSVButtons onCSVButtonClick={handleCSVButtonClick} />
    </div>
  );
};

export default AuthenticatedApp;