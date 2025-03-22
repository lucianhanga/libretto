import React from 'react';
import './PictureButtons.css';

const PictureButtons = ({ onTakePicture, onLoadPictureClick, isPulling }) => {
  return (
    <div className="button-container">
      <button onClick={onTakePicture} disabled={isPulling}>Take Picture</button>
      <button onClick={onLoadPictureClick} disabled={isPulling}>Load Picture</button>
    </div>
  );
};

export default PictureButtons;