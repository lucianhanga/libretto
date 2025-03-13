import { useEffect, useState } from 'react';
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from '../authConfig';

const useAuth = () => {
  const { instance, accounts } = useMsal();
  const { login, result, error } = useMsalAuthentication(InteractionType.Redirect, loginRequest);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
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

  return { accessToken, login };
};

export default useAuth;