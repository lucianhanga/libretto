import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, label }) => {
  const indicators = [];
  for (let i = 0; i < 10; i++) {
    indicators.push(
      <div
        key={i}
        className="progress-indicator"
        style={{ left: `${i * 10}%`, backgroundColor: progress >= i * 10 ? 'black' : 'transparent' }}
      ></div>
    );
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
