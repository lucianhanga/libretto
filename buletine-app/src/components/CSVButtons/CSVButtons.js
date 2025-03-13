import React, { useState } from 'react';
import './CSVButtons.css';

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
    // Your existing clear logic
  };

  const downloadCSV = () => {
    // Your existing download logic
  };

  return (
    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      <button onClick={() => handleButtonClick(toggleCSVDisplay)} style={csvButtonStyle}>
        {showCSV ? "Hide CSV" : "Show CSV"}
      </button>
      <button onClick={() => handleButtonClick(clearCSVData)} style={{ ...csvButtonStyle, backgroundColor: '#FF0000' }}>
        Clear CSV
      </button>
      <button onClick={() => handleButtonClick(downloadCSV)} style={{ ...csvButtonStyle, backgroundColor: '#28a745' }}>
        Download CSV
      </button>
    </div>
  );
};

const csvButtonStyle = {
  padding: '10px 20px',
  margin: '5px',
  cursor: 'pointer',
  backgroundColor: '#007BFF',
  color: '#FFF',
  borderRadius: '5px',
  border: 'none',
};

export default CSVButtons;