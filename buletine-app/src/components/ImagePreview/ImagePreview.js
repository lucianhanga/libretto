import React from "react";
import "./ImagePreview.css";

const ImagePreview = ({ image, onRetake, onSubmit }) => {
  return (
    <div>
      <img src={image} alt="Captured" style={{ width: "100%", maxWidth: "400px" }} />
      <div>
        <button className="btn btn-secondary" onClick={onRetake}>Retake Photo</button>
        <button className="btn btn-primary" onClick={onSubmit}>Submit Photo</button>
      </div>
    </div>
  );
};

export default ImagePreview;