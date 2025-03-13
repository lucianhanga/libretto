import React from 'react';
import './StatusBar.css';

const StatusBar = ({ status }) => {
  return (
    <div className={`status-bar ${status}`}>
      {status === 'sending' && 'Sending photo...'}
      {status === 'success' && 'Success'}
      {status === 'error' && 'Error submitting'}
    </div>
  );
};

export default StatusBar;
