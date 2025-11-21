import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import './SignInButton.css';

const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error('Login failed:', e);
    });
  };

  return (
    <button className="signin-button" onClick={handleLogin}>
      Sign in with Microsoft
    </button>
  );
};

export default SignInButton;
