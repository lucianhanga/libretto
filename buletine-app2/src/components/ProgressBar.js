import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress }) => {
  if (progress === 0) {
    return null; // Hide the component when progress is zero
  }

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;