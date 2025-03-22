import { useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../azureAuth/authConfig";

const useToken = () => {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (accounts.length > 0) {
      const request = {
        ...loginRequest,
        account: accounts[0]
      };

      instance.acquireTokenSilent(request).then(response => {
        console.log("OAuth2 Token:", response.accessToken);
      }).catch(error => {
        console.error("Failed to acquire token silently", error);
      });
    }
  }, [accounts, instance]);
};

export default useToken;