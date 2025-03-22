import React, { useState } from 'react';
import Profile from './Profile';
import StatusBar from './StatusBar';
import ProgressBar from './ProgressBar';
import PictureControl from './PictureControl';
import SubmitButton from './SubmitButton';
import ParsedDataDisplay from './ParsedDataDisplay';
import CSVButtons from './CSVButtons';
import CSVDisplay from './CSVDisplay';
import useToken from '../hooks/useToken';

const Authenticated = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready");
  const [imageSrc, setImageSrc] = useState(null);
  const [isPulling, setIsPulling] = useState(false);
  const [result, setResult] = useState([]);
  const [csvData, setCsvData] = useState('');
  const [showCSV, setShowCSV] = useState(false);

  useToken(); // Use the custom hook to acquire the token

  const handleShowCSV = () => {
    const data = localStorage.getItem("nameDisplayData") || '';
    setCsvData(data);
    setShowCSV(true);
  };

  const handleClearCSV = () => {
    localStorage.removeItem("nameDisplayData");
    setCsvData('');
    setShowCSV(false);
  };

  const handleDownloadCSV = () => {
    const data = localStorage.getItem("nameDisplayData") || '';
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Profile />
      <PictureControl setImageSrc={setImageSrc} setProgress={setProgress} isPulling={isPulling} />
      <SubmitButton imageSrc={imageSrc} setStatus={setStatus} setProgress={setProgress} setIsPulling={setIsPulling} setResult={setResult} isPulling={isPulling} />
      <ProgressBar progress={progress} />
      <ParsedDataDisplay result={result} />
      <CSVButtons showCSV={handleShowCSV} clearCSV={handleClearCSV} downloadCSV={handleDownloadCSV} />
      {showCSV && <CSVDisplay csvData={csvData} />}
      {/* Add more authenticated components here */}
      <StatusBar status={status} style={{ marginTop: '20px' }} />
    </div>
  );
};

export default Authenticated;