import React from 'react';
import './StatusBar.css';

const StatusBar = ({ status }) => {
  let message = '';
  if (status === 'sending') {
    message = 'Sending photo...';
  } else if (status === 'success') {
    message = 'Success';
  } else if (status === 'error') {
    message = 'Error submitting';
  } else if (status === 'pulling') {
    message = 'Pulling result...';
  }

  return (
    <div className={`status-bar ${status}`}>
      {message}
    </div>
  );
};

export default StatusBar;
