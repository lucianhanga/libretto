import dotenv from 'dotenv';

dotenv.config();

export const msalConfig = {
  auth: {
    clientId: '87097781-f360-444e-a162-ea34b8eeedd2', // Replace with your client ID
    authority: 'https://login.microsoftonline.com/9ddff61d-1e0f-425a-9643-d8a7cd9ad409', // Replace with your tenant ID
    redirectUri: process.env.REACT_APP_REDIRECT_URI, // Use environment variable for redirect URI
  },
};

export const loginRequest = {
  scopes: ["User.Read"]
};
