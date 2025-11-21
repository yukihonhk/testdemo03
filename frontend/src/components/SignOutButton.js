import React from 'react';
import { useMsal } from '@azure/msal-react';
import './SignOutButton.css';

const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => {
      console.error('Logout failed:', e);
    });
  };

  return (
    <button className="signout-button" onClick={handleLogout}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
