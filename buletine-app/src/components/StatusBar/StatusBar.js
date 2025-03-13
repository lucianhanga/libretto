import React from 'react';
import './StatusBar.css';

const StatusBar = ({ status, progress, progressLabel }) => {
  return (
    <div className={`status-bar ${status}`}>
      {status === 'sending' && 'Sending photo...'}
      {status === 'success' && 'Success'}
      {status === 'error' && 'Error submitting'}
      {status === 'pulling' && (
        <>
          <div>Pulling result...</div>
          <div>Progress: {progress}%</div>
        </>
      )}
      {progressLabel && <div>{progressLabel}</div>}
    </div>
  );
};

export default StatusBar;
