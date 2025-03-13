import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, label, status }) => {
  const indicators = [];
  if (status === 'pulling') {
    for (let i = 0; i < 10; i++) {
      indicators.push(
        <div
          key={i}
          className={`progress-indicator ${progress >= i * 10 ? 'filled' : ''}`}
          style={{ left: `${i * 10}%` }}
        ></div>
      );
    }
  }

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
        {indicators}
      </div>
      <div className="progress-label">{label}</div>
    </div>
  );
};

export default ProgressBar;
