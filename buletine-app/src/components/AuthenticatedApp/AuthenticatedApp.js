import React from 'react';
import WebcamCapture from '../WebcamCapture';
import ImagePreview from '../ImagePreview';
import CSVButtons from '../CSVButtons';
import StatusBar from '../StatusBar';
import './AuthenticatedApp.css';

const AuthenticatedApp = ({ image, capturing, handleCapture, handleFileChange, handleRetake, handleSubmit, setCapturing, isLoading, status, progress, progressLabel, handleCancel }) => {
  return (
    <div>
      <StatusBar status={status} progress={progress} progressLabel={progressLabel} />
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
        <ImagePreview image={image} onRetake={handleRetake} onSubmit={handleSubmit} isLoading={isLoading} onCancel={handleCancel} />
      )}
      <CSVButtons />
    </div>
  );
};

export default AuthenticatedApp;