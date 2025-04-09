import React, { useState } from 'react';
import Profile from './Profile';
import StatusBar from './StatusBar';
import ProgressBar from './ProgressBar';
import PictureControl from './PictureControl';
import SubmitButton from './SubmitButton';
import useToken from '../hooks/useToken';

const Authenticated = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready");
  const [imageSrc, setImageSrc] = useState(null);
  const [isPulling, setIsPulling] = useState(false);
  const [result, setResult] = useState([]);

  useToken(); // Use the custom hook to acquire the token

  const clearResults = () => {
    setResult([]);
  };

  return (
    <div>
      <Profile />
      <PictureControl
        setImageSrc={setImageSrc}
        setProgress={setProgress}
        isPulling={isPulling}
        clearResults={clearResults} // Passed here
      />
      <SubmitButton
        imageSrc={imageSrc}
        setStatus={setStatus}
        setProgress={setProgress}
        setIsPulling={setIsPulling}
        setResult={setResult}
        isPulling={isPulling}
        clearResults={clearResults} // Passed here
      />
      <ProgressBar progress={progress} />
      {/* Add more authenticated components here */}
      <StatusBar status={status} style={{ marginTop: '20px' }} />
    </div>
  );
};

export default Authenticated;