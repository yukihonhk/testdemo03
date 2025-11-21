// Microsoft Entra ID (Azure AD) Configuration for MSAL
export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || 'your-client-id',
    authority: process.env.REACT_APP_AZURE_AUTHORITY || 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Scopes for API access
export const loginRequest = {
  scopes: ['User.Read'],
};

// API Configuration
export const apiConfig = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
};
