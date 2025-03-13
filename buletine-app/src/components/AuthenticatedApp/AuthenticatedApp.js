import React, { useState } from 'react';
import WebcamCapture from '../WebcamCapture';
import ImagePreview from '../ImagePreview';
import CSVButtons from '../CSVButtons';
import ParsedDataDisplay from '../ParsedDataDisplay';
import './AuthenticatedApp.css';

const AuthenticatedApp = ({ image, capturing, handleCapture, handleFileChange, handleRetake, handleSubmit, setCapturing, isLoading, status, fields }) => {
  const [showParsedData, setShowParsedData] = useState(true);

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
    <div>
      {!image ? (
        <div className="button-group">
          <WebcamCapture onCapture={handleCapture} capturing={capturing} setCapturing={setCapturing} />
          {!capturing && (
            <label className="btn btn-secondary">
              Choose File
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
          )}
        </div>
      ) : (
        <ImagePreview image={image} onRetake={handleRetakeClick} onSubmit={handleSubmitClick} isLoading={isLoading} />
      )}
      {showParsedData && fields.length > 0 && <ParsedDataDisplay fields={fields} />}
      <CSVButtons onCSVButtonClick={handleCSVButtonClick} />
    </div>
  );
};

export default AuthenticatedApp;