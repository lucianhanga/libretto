import React, { useCallback, useState, useEffect } from 'react';
import './ParsedDataDisplay.css';
import { romanianToLatin, replaceNewLineWithDash, extractDates } from '../Utils';

const ParsedDataDisplay = ({ result }) => {
  const [saved, setSaved] = useState(false); // Track if data has been saved
  const [tooltip, setTooltip] = useState(null); // Track the tooltip message
  const [fields, setFields] = useState([]); // Track the parsed fields
  const [showResults, setShowResults] = useState(false); // Track whether to show results

  const parseAndSaveResult = useCallback((result) => {
    console.log("Incoming result:", result); // Log the incoming result

    let parsedResult;

    result = result.Document;

    // Parse result if it's a string
    if (typeof result === 'string') {
      try {
        parsedResult = JSON.parse(result);
      } catch (error) {
        console.error("Error parsing result:", error);
        parsedResult = null;
      }
    } else {
      parsedResult = result;
    }

    console.log("Parsed result:", parsedResult); // Log the parsed result

    // Extract the address content and check if it's available
    let dateOfIssue = "Not available";
    let dateOfExpiration = "Not available";

    if (parsedResult?.fields?.DateOfIssue?.content) {
      [dateOfIssue, dateOfExpiration] = extractDates(parsedResult.fields.DateOfIssue.content);
      console.log(`Extracted dates - Date of Issue: ${dateOfIssue}, Date of Expiration: ${dateOfExpiration}`);
    }

    // Extract data if parsedResult and fields exist
    const extractedFields = parsedResult && parsedResult.fields ? [
      { label: "First Name", value: romanianToLatin(parsedResult.fields.FirstName?.value || 'Not available') },
      { label: "Last Name",  value: romanianToLatin(parsedResult.fields.LastName?.value  || 'Not available') },
      { label: "Address",    value: romanianToLatin(parsedResult.fields.Address?.content || 'Not available') },
      { label: "Personal Number", value: parsedResult.fields.PersonalNumber?.value || 'Not available' },
      { label: "Document Number", value: replaceNewLineWithDash(parsedResult.fields.DocumentNumber?.content || 'Not available') },
      { label: "Date of Issue", value: dateOfIssue },
      { label: "Date of Expiration", value: dateOfExpiration },
    ] : [];

    // Log the extracted fields
    console.log("Extracted fields:", extractedFields);

    // Save data to local storage in CSV format
    saveToLocalStorage(extractedFields);

    // Set the parsed fields to state
    setFields(extractedFields);
    setShowResults(true); // Show results when data is received
  }, [saved]);

  const saveToLocalStorage = (fields) => {
    if (!saved && fields.length > 0) {
      const currentCsvData = localStorage.getItem("nameDisplayData") || "";

      // Remove newlines from each field value
      const newRow = fields.map(field => field.value.replace(/\n/g, ' ')).join(",") + "\n";

      const updatedCsvData = currentCsvData + newRow;
      localStorage.setItem("nameDisplayData", updatedCsvData);
      console.log("Data saved to local storage.");
      setSaved(true); // Mark as saved to avoid duplication
    }
  };

  useEffect(() => {
    if (result) {
      parseAndSaveResult(result);
    }
  }, [result, parseAndSaveResult]);

  // Copy value to clipboard and show tooltip
  const handleDoubleClick = (value) => {
    navigator.clipboard.writeText(value).then(() => {
      setTooltip("Copied to clipboard!");
      setTimeout(() => setTooltip(null), 1000); // Hide tooltip after 1 second
    });
  };

  return (
    <div>
      {showResults && fields.length > 0 && (
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

          {/* Buttons */}
          <div className="button-container">
            <button
              onClick={() => saveToLocalStorage(fields)}
              disabled={saved} // Disable the button if data has been saved
              className={`save-button ${saved ? 'disabled' : ''}`}
            >
              {saved ? "Saved" : "Save to CSV"}
            </button>
            <button
              onClick={() => setShowResults(false)}
              className="hide-button"
            >
              Hide
            </button>
          </div>
        </div>
      )}

      {!showResults && fields.length > 0 && (
        <button
          onClick={() => setShowResults(true)}
          className="show-button"
        >
          Show
        </button>
      )}
    </div>
  );
};

export default ParsedDataDisplay;