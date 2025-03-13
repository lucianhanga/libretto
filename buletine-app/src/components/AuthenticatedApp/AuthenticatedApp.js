import React from 'react';
import WebcamCapture from '../WebcamCapture';
import ImagePreview from '../ImagePreview';
import CSVButtons from '../CSVButtons';
import LoadingSpinner from '../LoadingSpinner';
import './AuthenticatedApp.css';

const AuthenticatedApp = ({ image, capturing, handleCapture, handleFileChange, handleRetake, handleSubmit, setCapturing, isLoading }) => {
  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
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
            <ImagePreview image={image} onRetake={handleRetake} onSubmit={handleSubmit} />
          )}
          <CSVButtons />
        </>
      )}
    </div>
  );
};

export default AuthenticatedApp;