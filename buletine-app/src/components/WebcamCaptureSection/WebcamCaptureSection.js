import React from 'react';
import WebcamCapture from '../WebcamCapture';
import './WebcamCaptureSection.css';

const WebcamCaptureSection = ({ handleCapture, capturing, setCapturing, handleFileChange }) => (
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
);

export default WebcamCaptureSection;
