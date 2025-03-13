import { useState, useCallback } from 'react';
import { extractDates, romanianToLatin, replaceNewLineWithDash } from '../Utils';

const useResultPulling = (accessToken) => {
  const [status, setStatus] = useState('');
  const [saved, setSaved] = useState(false); // Track if data has been saved
  const [fields, setFields] = useState([]); // Store the parsed fields
  const [showParsedData, setShowParsedData] = useState(false); // Track whether to show parsed data

  const startPullingResult = (id) => {
    console.log("Starting result pulling process...");
    setTimeout(() => {
      setStatus('pulling 1');
      let attempts = 0;
      const interval = setInterval(async () => {
        console.log(`Attempt ${attempts + 1} to pull result...`);
        if (attempts >= 10) {
          clearInterval(interval);
          setStatus('error');
          console.error("Failed to retrieve result after 10 attempts");
          return;
        }

        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/pullresults?guid=${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (response.ok) {
            const resultData = await response.json();
            console.log("Result retrieved successfully:", resultData);
            clearInterval(interval);
            setStatus('success');
            parseAndSaveResult(resultData);
            setShowParsedData(true); // Show parsed data
          } else {
            const errorText = await response.text();
            console.error("Failed to retrieve result:", errorText);
          }
        } catch (error) {
          console.error("Error retrieving result:", error);
        }

        attempts++;
        setStatus(`pulling ${attempts + 1}`);
      }, 5000); // 5-second interval
    }, 5000); // Initial 5-second delay
  };

  const parseAndSaveResult = useCallback((result) => {
    let parsedResult;

    result = result.Document;

    // Parse result if it's a string
    if (typeof result === 'string') {
      try {
        parsedResult = JSON.parse(result);
      } catch (error) {
        parsedResult = null;
      }
    } else {
      parsedResult = result;
    }

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
    if (!saved && extractedFields.length > 0) {
      const currentCsvData = localStorage.getItem("nameDisplayData") || "";

      // Remove newlines from each field value
      const newRow = extractedFields.map(field => field.value.replace(/\n/g, ' ')).join(",") + "\n";

      const updatedCsvData = currentCsvData + newRow;
      localStorage.setItem("nameDisplayData", updatedCsvData);
      console.log("Data saved to local storage.");
      setSaved(true); // Mark as saved to avoid duplication
    }

    // Set the parsed fields to state
    setFields(extractedFields);
  }, [saved]);

  return {
    status,
    startPullingResult,
    fields,
    showParsedData,
    setShowParsedData
  };
};

export default useResultPulling;