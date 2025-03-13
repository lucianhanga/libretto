import React from 'react';
import WebcamCapture from '../WebcamCapture';
import ImagePreview from '../ImagePreview';
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
      {/* Title Section */}
      <div className="title-section">
        <h1>Blondu Buletine</h1>
      </div>

      {/* Placeholder Section */}
      {!image && !capturing && (
        <div className="placeholder-section">
          <img src="/logo512.png" alt="Placeholder" className="placeholder-image" />
        </div>
      )}

      {/* WebcamCapture Section */}
      {!image && (
        <div className="webcam-capture-section">
          <div className="button-group">
            <WebcamCapture onCapture={handleCapture} capturing={capturing} setCapturing={setCapturing} />
            {!capturing && (
              <label className="btn btn-secondary">
                Choose File
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            )}
          </div>
        </div>
      )}

      {/* ImagePreview Section */}
      {image && (
        <div className="image-preview-section">
          <ImagePreview image={image} onRetake={handleRetakeClick} onSubmit={handleSubmitClick} isLoading={isLoading} />
        </div>
      )}

      {/* ParsedDataDisplay Section */}
      {showParsedData && fields.length > 0 && <ParsedDataDisplay fields={fields} />}

      {/* CSVButtons Section */}
      <CSVButtons onCSVButtonClick={handleCSVButtonClick} />
    </div>
  );
};

export default AuthenticatedApp;