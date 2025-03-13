import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from './authConfig';
import WebcamCapture from './components/WebcamCapture';
import ImagePreview from './components/ImagePreview';
import CSVButtons from './components/CSVButtons';
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
        console.log("Photo submitted successfully");
        setImage(null);
      } else {
        console.error("Failed to submit photo", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting photo", error);
    }
  };

  return (
    <div className="container">
      <h1>React Webcam Capture</h1>
      <AuthenticatedTemplate>
        {!image ? (
          <div className="button-group">
            <WebcamCapture onCapture={handleCapture} capturing={capturing} setCapturing={setCapturing} />
            {!capturing && (
              <label className="btn btn-secondary">
                Choose File
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            )}
          </div>
        ) : (
          <ImagePreview image={image} onRetake={handleRetake} onSubmit={handleSubmit} />
        )}
        <CSVButtons />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>You need to sign in to use the app.</p>
        <button onClick={() => login()}>Sign In</button>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default App;
