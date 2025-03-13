import React from 'react';
import ProgressBar from '../ProgressBar';
import './StatusBar.css';

const StatusBar = ({ status, progress, progressLabel }) => {
  return (
    <div className={`status-bar ${status}`}>
      {status === 'sending' && 'Sending photo...'}
      {status === 'success' && 'Success'}
      {status === 'error' && 'Error submitting'}
      {status === 'pulling' && 'Pulling result...'}
      {(status === 'sending' || status === 'pulling') && (
        <ProgressBar progress={progress} label={progressLabel} />
      )}
    </div>
  );
};

export default StatusBar;
