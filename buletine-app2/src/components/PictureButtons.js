import React from 'react';
import './PictureButtons.css';

const PictureButtons = ({ onTakePicture, onLoadPictureClick, isPulling, clearResults }) => {
  return (
    <div className="button-container">
      <button onClick={() => { onTakePicture(); clearResults(); }} disabled={isPulling}>Take Picture</button>
      <button onClick={() => { onLoadPictureClick(); clearResults(); }} disabled={isPulling}>Load Picture</button>
    </div>
  );
};

export default PictureButtons;