import React from 'react';
import './PictureHolder.css';

const PictureHolder = ({ imageSrc }) => {
  return (
    <div className="picture-holder">
      {imageSrc ? (
        <img src={imageSrc} alt="Captured" className="captured-image" />
      ) : (
        <div className="image-placeholder">No image</div>
      )}
    </div>
  );
};

export default PictureHolder;