import React from 'react';
import './CSVButtons.css';

const CSVButtons = ({ showCSV, clearCSV, downloadCSV, isCSVShown }) => {
  return (
    <div className="csv-buttons">
      <button onClick={showCSV} className="csv-button">
        {isCSVShown ? "Hide CSV" : "Show CSV"}
      </button>
      <button onClick={clearCSV} className="csv-button">Clear CSV</button>
      <button onClick={downloadCSV} className="csv-button">Download CSV</button>
    </div>
  );
};

export default CSVButtons;