import React from 'react';
import WebcamCapture from '../WebcamCapture';
import ImagePreview from '../ImagePreview';
import CSVButtons from '../CSVButtons';
import StatusBar from '../StatusBar';
import ProgressBar from '../ProgressBar';
import './AuthenticatedApp.css';

const AuthenticatedApp = ({ image, capturing, handleCapture, handleFileChange, handleRetake, handleSubmit, setCapturing, isLoading, status, progress, progressLabel }) => {
  return (
    <div>
      <StatusBar status={status} />
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
        <ImagePreview image={image} onRetake={handleRetake} onSubmit={handleSubmit} isLoading={isLoading} />
      )}
      <CSVButtons />
      {(status === 'sending' || status === 'pulling') && <ProgressBar progress={progress} label={progressLabel} />}
    </div>
  );
};

export default AuthenticatedApp;