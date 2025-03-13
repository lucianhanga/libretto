import { useState } from 'react';

const useImageUpload = (accessToken) => {
  const [image, setImage] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');

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

    const requestBody = createRequestBody(image);

    console.log("Request body JSON:", JSON.stringify(requestBody, null, 2));

    setIsLoading(true);
    setStatus('sending');
    setProgress(0);
    setProgressLabel('Sending photo...');

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + (100 / 30);
        if (newProgress >= 100) {
          clearInterval(interval);
        }
        return newProgress;
      });
    }, 1000);

    try {
      const response = await submitPhoto(requestBody);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Photo submitted successfully:", responseData);
        setStatus('success');
        setProgress(100);
        setProgressLabel('Photo submitted successfully');
        clearInterval(interval);
        return responseData.id;
      } else {
        handleErrorResponse(response);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRequestBody = (image) => {
    const fileExtension = image.split(';')[0].split('/')[1];
    const base64Image = image.split(',')[1];

    return {
      image: base64Image,
      extension: fileExtension
    };
  };

  const submitPhoto = async (requestBody) => {
    return await fetch(`${process.env.REACT_APP_API_BASE_URL}/uploadimage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  };

  const handleErrorResponse = async (response) => {
    const errorData = await response.text();
    console.error("Failed to submit photo:", errorData);
    setStatus('error');
    setProgressLabel('Error submitting photo');
  };

  const handleError = (error) => {
    console.error("Error submitting photo:", error);
    setStatus('error');
    setProgressLabel('Error submitting photo');
  };

  return {
    image,
    capturing,
    isLoading,
    status,
    progress,
    progressLabel,
    handleCapture,
    handleFileChange,
    handleRetake,
    handleSubmit,
    setCapturing
  };
};

export default useImageUpload;