import React, { useCallback, useState } from 'react';
import './ParsedDataDisplay.css';

const ParsedDataDisplay = ({ fields }) => {
  const [saved, setSaved] = useState(false); // Track if data has been saved
  const [tooltip, setTooltip] = useState(null); // Track the tooltip message

  // Save data to local storage in CSV format
  const saveToLocalStorage = useCallback(() => {
    if (!saved && fields.length > 0) {
      const currentCsvData = localStorage.getItem("nameDisplayData") || "";

      // Remove newlines from each field value
      const newRow = fields.map(field => field.value.replace(/\n/g, ' ')).join(",") + "\n";

      const updatedCsvData = currentCsvData + newRow;
      localStorage.setItem("nameDisplayData", updatedCsvData);
      console.log("Data saved to local storage.");
      setSaved(true); // Mark as saved to avoid duplication
    }
  }, [fields, saved]);

  // Copy value to clipboard and show tooltip
  const handleDoubleClick = (value) => {
    navigator.clipboard.writeText(value).then(() => {
      setTooltip("Copied to clipboard!");
      setTimeout(() => setTooltip(null), 1000); // Hide tooltip after 1 second
    });
  };

  return (
    <div>
      {/* Display the parsed fields in a table */}
      {fields.length > 0 && (
        <table className="parsed-data-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={index}>
                <td>{field.label}:</td>
                <td onDoubleClick={() => handleDoubleClick(field.value)}>{field.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Tooltip */}
      {tooltip && <div className="tooltip">{tooltip}</div>}

      {/* Button to save the data to CSV */}
      <button
        onClick={saveToLocalStorage}
        disabled={saved} // Disable the button if data has been saved
        className={`save-button ${saved ? 'disabled' : ''}`}
      >
        {saved ? "Saved" : "Save to CSV"}
      </button>
    </div>
  );
};

export default ParsedDataDisplay;