import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: '87097781-f360-444e-a162-ea34b8eeedd2', // Replace with your client ID
    authority: 'https://login.microsoftonline.com/9ddff61d-1e0f-425a-9643-d8a7cd9ad409', // Replace with your tenant ID
    redirectUri: process.env.REACT_APP_REDIRECT_URI || "wrong value", // Use environment variable for redirect URI
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            console.log(message);
            break;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"]
};
