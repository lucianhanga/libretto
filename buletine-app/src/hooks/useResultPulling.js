import { useState } from 'react';

const useResultPulling = (accessToken) => {
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');

  const startPullingResult = (id) => {
    setTimeout(() => {
      setStatus('pulling');
      setProgress(0);
      setProgressLabel('Pulling result...');
      let attempts = 0;
      const interval = setInterval(async () => {
        if (attempts >= 10) {
          clearInterval(interval);
          setStatus('error');
          setProgressLabel('Failed to retrieve result after 10 attempts');
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
            setProgress(100);
            setProgressLabel('Result retrieved successfully');
          } else {
            console.error("Failed to retrieve result:", await response.text());
          }
        } catch (error) {
          console.error("Error retrieving result:", error);
        }

        attempts++;
        setProgress((attempts / 10) * 100);
      }, 20000);
    }, 10000);
  };

  return {
    status,
    progress,
    progressLabel,
    startPullingResult
  };
};

export default useResultPulling;