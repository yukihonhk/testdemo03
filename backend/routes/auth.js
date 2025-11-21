const express = require('express');
const router = express.Router();
const { cca } = require('../middleware/auth');

// Login endpoint - returns auth URL
router.get('/login', (req, res) => {
  const authCodeUrlParameters = {
    scopes: ['user.read'],
    redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:3000',
  };

  // Get url to sign user in and consent to scopes needed for application
  cca.getAuthCodeUrl(authCodeUrlParameters)
    .then((response) => {
      res.json({ authUrl: response });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate auth URL' });
    });
});

// Callback endpoint - exchanges code for token
router.post('/callback', async (req, res) => {
  const { code } = req.body;

  const tokenRequest = {
    code: code,
    scopes: ['user.read'],
    redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:3000',
  };

  try {
    const response = await cca.acquireTokenByCode(tokenRequest);
    res.json({
      accessToken: response.accessToken,
      idToken: response.idToken,
      account: response.account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to acquire token' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
