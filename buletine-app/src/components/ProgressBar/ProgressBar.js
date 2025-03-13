import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, label }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-label">{label}</div>
    </div>
  );
};

export default ProgressBar;
