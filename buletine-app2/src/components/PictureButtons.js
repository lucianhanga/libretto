import React from 'react';
import './PictureButtons.css';

const PictureButtons = ({ onTakePicture, onLoadPictureClick }) => {
  return (
    <div className="button-container">
      <button onClick={onTakePicture}>Take Picture</button>
      <button onClick={onLoadPictureClick}>Load Picture</button>
    </div>
  );
};

export default PictureButtons;