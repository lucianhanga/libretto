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

  useToken(); // Use the custom hook to acquire the token

  // This is just a placeholder for updating progress. Replace it with actual logic.
  const simulateProgress = () => {
    setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
  };

  return (
    <div>
      <Profile />
      <PictureControl setImageSrc={setImageSrc} />
      <SubmitButton imageSrc={imageSrc} setStatus={setStatus} />
      <ProgressBar progress={progress} />
      <button onClick={simulateProgress}>Simulate Progress</button>
      {/* Add more authenticated components here */}
      <StatusBar status={status} />
    </div>
  );
};

export default Authenticated;