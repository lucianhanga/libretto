import React, { useState } from "react";
import WebcamCapture from "./components/WebcamCapture";
import ImagePreview from "./components/ImagePreview";
import CSVButtons from "./components/CSVButtons";
import "./App.css"; // Import the CSS file

const App = () => {
  const [image, setImage] = useState(null);

  const handleCapture = (imgSrc) => {
    setImage(imgSrc);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setImage(null);
  };

  const handleSubmit = () => {
    console.log("Photo submitted:", image);
    setImage(null);
  };

  return (
    <div className="container">
      <h1>React Webcam Capture</h1>
      {!image ? (
        <>
          <WebcamCapture onCapture={handleCapture} />
          <input type="file" accept="image/*" onChange={handleFileChange} className="btn btn-secondary" />
        </>
      ) : (
        <ImagePreview image={image} onRetake={handleRetake} onSubmit={handleSubmit} />
      )}
      <CSVButtons />
    </div>
  );
};

export default App;
