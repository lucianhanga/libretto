import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../azureAuth/authConfig";
import './SubmitButton.css';

const SubmitButton = ({ imageSrc, setStatus, setProgress }) => {
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
        setStatus("Successfully Sent");
        setProgress(10); // Update progress to 10% when sending is successful
      } else {
        setStatus("Error Sending");
        setProgress(0); // Reset progress to 0% on error
      }
    } catch (error) {
      setStatus("Error Sending");
      setProgress(0); // Reset progress to 0% on error
    }
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      const request = {
        ...loginRequest,
        account: accounts[0]
      };

      try {
        const response = await instance.acquireTokenSilent(request);
        setAccessToken(response.accessToken);
        const requestBody = createRequestBody(imageSrc);
        await submitPhoto(requestBody);
      } catch (error) {
        console.error("Failed to acquire token silently", error);
        setStatus("Error Sending");
        setProgress(0); // Reset progress to 0% on error
      }
    } else {
      const requestBody = createRequestBody(imageSrc);
      await submitPhoto(requestBody);
    }
  };

  return (
    <div className="submit-button-container">
      <button className="submit-button" onClick={handleSubmit} disabled={!imageSrc}>
        Submit Picture
      </button>
    </div>
  );
};

export default SubmitButton;