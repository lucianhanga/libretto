import React from 'react';
import { useMsal } from "@azure/msal-react";
import './Profile.css';

const Profile = () => {
  const { accounts } = useMsal();
  const username = accounts[0] && accounts[0].username;

  return (
    <div className="profile">
      <h1>Welcome, {username}</h1>
    </div>
  );
};

export default Profile;