import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import PictureHolder from './PictureHolder';
import PictureButtons from './PictureButtons';
import './PictureControl.css';

const PictureControl = ({ setImageSrc, setProgress, isPulling, clearResults }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [imageSrc, setImageSrcState] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleTakePicture = () => {
    setIsCameraOn(true);
    setProgress(0); // Reset progress when taking a picture
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setImageSrcState(imageSrc);
    setIsCameraOn(false);
  };

  const handleLoadPicture = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setImageSrcState(reader.result);
      setProgress(0); // Reset progress when loading a picture
    };
    reader.readAsDataURL(file);
  };

  const handleLoadPictureClick = () => {
    fileInputRef.current.click();
    setProgress(0); // Reset progress when clicking to load a picture
  };

  return (
    <div className="picture-control">
      {isCameraOn ? (
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <button className="capture-button" onClick={handleCapture} disabled={isPulling}>Capture</button>
        </div>
      ) : (
        <div>
          <PictureHolder imageSrc={imageSrc} />
          <PictureButtons
            onTakePicture={handleTakePicture}
            onLoadPictureClick={handleLoadPictureClick}
            isPulling={isPulling}
            clearResults={clearResults} // Pass clearResults here
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleLoadPicture}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default PictureControl;