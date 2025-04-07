import React from 'react';
import './CSVDisplay.css';

const CSVDisplay = ({ csvData }) => {
  return (
    <div className="csv-display">
      <pre>{csvData}</pre>
    </div>
  );
};

export default CSVDisplay;