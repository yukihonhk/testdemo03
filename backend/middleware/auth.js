const msal = require('@azure/msal-node');
const authConfig = require('../config/authConfig');

// Create MSAL application
const msalConfig = {
  auth: authConfig.auth,
  system: authConfig.system,
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer token
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // SECURITY NOTE: Token verification simplified for development
    // In production, properly validate the token:
    // 1. Verify token signature using JWKS from Microsoft
    // 2. Validate token claims (aud, iss, exp, nbf)
    // 3. Check token hasn't been revoked
    // See SECURITY.md for implementation details
    // TODO: Implement proper token validation for production
    req.user = { authenticated: true };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { verifyToken, cca };
