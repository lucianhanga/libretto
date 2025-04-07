import React from 'react';
import './StatusBar.css';

const StatusBar = ({ status }) => {
  return (
    <div className="status-bar">
      {status}
    </div>
  );
};

export default StatusBar;