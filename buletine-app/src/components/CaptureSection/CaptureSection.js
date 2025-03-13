import React from 'react';
import PlaceholderSection from '../PlaceholderSection';
import WebcamCaptureSection from '../WebcamCaptureSection';
import ImagePreviewSection from '../ImagePreviewSection';
import './CaptureSection.css';

const CaptureSection = ({ image, capturing, handleCapture, handleFileChange, handleRetakeClick, handleSubmitClick, setCapturing, isLoading }) => {
  return (
    <div className="capture-section">
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
    </div>
  );
};

export default CaptureSection;