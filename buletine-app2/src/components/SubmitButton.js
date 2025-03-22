import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../azureAuth/authConfig";
import './SubmitButton.css';

const SubmitButton = ({ imageSrc, setStatus, setProgress, setIsPulling, isPulling }) => {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState(null);

  const createRequestBody = (image) => {
    const fileExtension = image.split(';')[0].split('/')[1];
    const base64Image = image.split(',')[1];

    return {
      image: base64Image,
      extension: fileExtension
    };
  };

  const acquireToken = async () => {
    const request = {
      ...loginRequest,
      account: accounts[0]
    };

    try {
      const response = await instance.acquireTokenSilent(request);
      setAccessToken(response.accessToken);
      return response.accessToken;
    } catch (error) {
      console.error("Failed to acquire token silently", error);
      setStatus("Error Acquiring Token");
      setProgress(0); // Reset progress to 0% on error
      throw error;
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const pullResults = async (guid, attempts = 10) => {
    setIsPulling(true); // Disable buttons during pulling
    await delay(5000); // Initial delay before starting to pull results
    for (let i = 0; i < attempts; i++) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/pullresults?guid=${guid}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Results:", result);
          setStatus("Results Pulled Successfully");
          setProgress(100); // Update progress to 100% when results are pulled successfully
          setTimeout(() => setProgress(0), 2000); // Reset progress to 0% after 2 seconds
          setIsPulling(false); // Enable buttons after pulling
          return;
        } else {
          console.warn("Results not ready, retrying...");
        }
      } catch (error) {
        console.error("Error Pulling Results", error);
      }

      setProgress(prevProgress => prevProgress + 9); // Increment progress with each attempt
      await delay(5000); // Wait for 5 seconds before retrying
    }

    setStatus("Error Pulling Results");
    setProgress(0); // Reset progress to 0% on error
    setIsPulling(false); // Enable buttons after pulling
  };

  const submitPhoto = async (requestBody) => {
    setStatus("Sending");
    setProgress(5); // Update progress to 5% when sending starts
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/uploadimage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const { id } = await response.json();
        console.log("Submission Response:", { id });
        setStatus("Successfully Sent");
        setProgress(10); // Update progress to 10% when sending is successful
        await pullResults(id); // Trigger pulling of results using the GUID
      } else {
        setStatus("Error Sending");
        setProgress(0); // Reset progress to 0% on error
      }
    } catch (error) {
      console.error("Error Sending", error);
      setStatus("Error Sending");
      setProgress(0); // Reset progress to 0% on error
    }
  };

  const handleSubmit = async () => {
    try {
      const token = accessToken || await acquireToken();
      const requestBody = createRequestBody(imageSrc);
      await submitPhoto(requestBody);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <div className="submit-button-container">
      <button className="submit-button" onClick={handleSubmit} disabled={!imageSrc || isPulling}>
        Submit Picture
      </button>
    </div>
  );
};

export default SubmitButton;