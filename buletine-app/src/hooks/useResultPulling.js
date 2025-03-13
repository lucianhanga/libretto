import { useState } from 'react';

const useResultPulling = (accessToken) => {
  const [status, setStatus] = useState('');

  const startPullingResult = (id) => {
    console.log("Starting result pulling process...");
    setTimeout(() => {
      setStatus('pulling');
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
          } else {
            const errorText = await response.text();
            console.error("Failed to retrieve result:", errorText);
          }
        } catch (error) {
          console.error("Error retrieving result:", error);
        }

        attempts++;
      }, 5000); // 5-second interval
    }, 5000); // Initial 5-second delay
  };

  return {
    status,
    startPullingResult
  };
};

export default useResultPulling;