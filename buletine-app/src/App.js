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
  const [status, setStatus] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [progressLabel, setProgressLabel] = React.useState('');

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
    setStatus('sending');
    setProgress(0);
    setProgressLabel('Sending photo...');

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
        setStatus('success');
        setProgress(100);
        setProgressLabel('Photo submitted successfully');
        startPullingResult(responseData.id);
      } else {
        const errorData = await response.text();
        console.error("Failed to submit photo:", errorData);
        setStatus('error');
        setProgressLabel('Error submitting photo');
      }
    } catch (error) {
      console.error("Error submitting photo:", error);
      setStatus('error');
      setProgressLabel('Error submitting photo');
    } finally {
      setIsLoading(false);
    }
  };

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
          status={status}
          progress={progress}
          progressLabel={progressLabel}
        />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <UnauthenticatedApp login={login} />
      </UnauthenticatedTemplate>
    </div>
  );
};

export default App;
