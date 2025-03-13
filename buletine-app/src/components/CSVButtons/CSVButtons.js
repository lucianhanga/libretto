import React, { useState } from 'react';
import './CSVButtons.css';
import CSVDisplay from '../CSVDisplay';

const CSVButtons = ({ onCSVButtonClick }) => {
  const [showCSV, setShowCSV] = useState(false);

  const handleButtonClick = (callback) => {
    onCSVButtonClick();
    callback();
  };

  const toggleCSVDisplay = () => {
    setShowCSV(!showCSV);
  };

  const clearCSVData = () => {
    localStorage.removeItem("nameDisplayData");
    setShowCSV(false);
  };

  const downloadCSV = () => {
    const csvData = localStorage.getItem("nameDisplayData");
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => handleButtonClick(toggleCSVDisplay)} className="csv-button">
          {showCSV ? "Hide CSV" : "Show CSV"}
        </button>
        <button onClick={() => handleButtonClick(clearCSVData)} className="csv-button red">
          Clear CSV
        </button>
        <button onClick={() => handleButtonClick(downloadCSV)} className="csv-button green">
          Download CSV
        </button>
      </div>
      {showCSV && <CSVDisplay />}
    </div>
  );
};

export default CSVButtons;