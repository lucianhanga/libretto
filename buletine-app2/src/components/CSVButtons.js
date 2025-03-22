import React from 'react';
import './CSVButtons.css';

const CSVButtons = ({ showCSV, clearCSV, downloadCSV }) => {
  return (
    <div className="csv-buttons">
      <button onClick={showCSV} className="csv-button">Show CSV</button>
      <button onClick={clearCSV} className="csv-button">Clear CSV</button>
      <button onClick={downloadCSV} className="csv-button">Download CSV</button>
    </div>
  );
};

export default CSVButtons;