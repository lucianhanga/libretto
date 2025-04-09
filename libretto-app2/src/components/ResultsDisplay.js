import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ result }) => {
  console.log("Received result in ResultsDisplay:", result);

  // Ensure the result and its Document field are valid
  if (!result ||  !result.analyzeResult || !result.analyzeResult.paragraphs) {
    console.error("Invalid result structure:", result);
    return <div className="results-display">No results to display.</div>;
  }

  const paragraphs = result.analyzeResult.paragraphs;

  return (
    <div className="results-display">
      <h2>Extracted Results</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {paragraphs.map((paragraph, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{paragraph.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsDisplay;