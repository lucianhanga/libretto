import React, { useEffect, useState } from 'react';
import './CSVDisplay.css';

const CSVDisplay = () => {
  const [savedData, setSavedData] = useState([]);

  useEffect(() => {
    // Fetch and parse the CSV data from localStorage
    const fetchCSVData = () => {
      const csvData = localStorage.getItem("nameDisplayData");
      if (csvData) {
        const parsedData = csvData.trim().split("\n").map(row => {
          const [firstName, lastName, address, personalNumber, documentNumber, issueDate, expirationDate] = row.split(",");
          return { firstName, lastName, address, personalNumber, documentNumber, issueDate, expirationDate };
        });
        setSavedData(parsedData);
      }
    };

    fetchCSVData();
  }, []);

  return (
    <div>
      <h3>Saved Data</h3>
      {savedData.length > 0 ? (
        <table className="csv-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Personal Nr</th>
              <th>Document Nr</th>
              <th>Issue Date</th>
              <th>Expiration Date</th>
            </tr>
          </thead>
          <tbody>
            {savedData.map((data, index) => (
              <tr key={index}>
                <td>{data.firstName}</td>
                <td>{data.lastName}</td>
                <td>{data.address}</td>
                <td>{data.personalNumber}</td>
                <td>{data.documentNumber}</td>
                <td>{data.issueDate}</td>
                <td>{data.expirationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No CSV data available.</p>
      )}
    </div>
  );
};

export default CSVDisplay;