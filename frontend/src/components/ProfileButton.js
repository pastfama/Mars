import React from 'react';

const ProfileButton = ({ setActiveSection }) => {
  const handleClick = () => {
    setActiveSection('Profile');
  };

  return (
    <div className="menu-item" onClick={handleClick}>
      Profile
    </div>
  );
};

export default ProfileButton;