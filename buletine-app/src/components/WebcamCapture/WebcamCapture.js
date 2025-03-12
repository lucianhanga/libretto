import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./WebcamCapture.css";

const WebcamCapture = ({ onCapture }) => {
  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef(null);

  const capturePhoto = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    onCapture(imgSrc);
    setCapturing(false);
  };

  return (
    <div>
      {!capturing ? (
        <button className="btn btn-primary" onClick={() => setCapturing(true)}>Capture Photo</button>
      ) : (
        <div>
          <Webcam ref={webcamRef} screenshotFormat="image/png" />
          <button className="btn btn-primary" onClick={capturePhoto}>Take Photo</button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;