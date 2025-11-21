// Microsoft Entra ID (Azure AD) Configuration
module.exports = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || 'your-client-id',
    authority: process.env.AZURE_AUTHORITY || 'https://login.microsoftonline.com/your-tenant-id',
    clientSecret: process.env.AZURE_CLIENT_SECRET || 'your-client-secret',
    redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:3000',
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};
