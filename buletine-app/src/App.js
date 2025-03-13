import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from './authConfig';
import AuthenticatedApp from './components/AuthenticatedApp';
import UnauthenticatedApp from './components/UnauthenticatedApp';
import './App.css';

const App = () => {
  const { instance, accounts } = useMsal();
  const { login, result, error } = useMsalAuthentication(InteractionType.Redirect, loginRequest);

  React.useEffect(() => {
    if (result) {
      console.log("Authentication successful:", result);
      acquireToken();
    }
    if (error) {
      console.error("Authentication error:", error);
    }
  }, [result, error]);

  const acquireToken = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      });
      console.log("Access token acquired:", response.accessToken);
      setAccessToken(response.accessToken);
    } catch (e) {
      console.error("Token acquisition failed:", e);
    }
  };

  const [image, setImage] = React.useState(null);
  const [capturing, setCapturing] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCapture = (imgSrc) => {
    setImage(imgSrc);
    setCapturing(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    const fileExtension = image.split(';')[0].split('/')[1];
    const base64Image = image.split(',')[1];

    const requestBody = {
      image: base64Image,
      extension: fileExtension
    };

    console.log("Request body JSON:", JSON.stringify(requestBody, null, 2));

    setIsLoading(true);

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
        const responseData = await response.json();
        console.log("Photo submitted successfully:", responseData);
        setImage(null);
      } else {
        const errorData = await response.text();
        console.error("Failed to submit photo:", errorData);
      }
    } catch (error) {
      console.error("Error submitting photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>React Webcam Capture</h1>
      <AuthenticatedTemplate>
        <AuthenticatedApp
          image={image}
          capturing={capturing}
          handleCapture={handleCapture}
          handleFileChange={handleFileChange}
          handleRetake={handleRetake}
          handleSubmit={handleSubmit}
          setCapturing={setCapturing}
          isLoading={isLoading}
        />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <UnauthenticatedApp login={login} />
      </UnauthenticatedTemplate>
    </div>
  );
};

export default App;
