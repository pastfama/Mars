import React from 'react';

const Menu = ({ setActiveSection }) => {
  return (
    <div className="menu">
      <button onClick={() => setActiveSection('Profile')}>Profile</button>
      <button onClick={() => setActiveSection('Relationships')}>Relationships</button>
      <button onClick={() => setActiveSection('Activities')}>Activities</button>
      <button onClick={() => setActiveSection('Assets')}>Assets</button>
      <button onClick={() => setActiveSection('Settings')}>Settings</button>
    </div>
  );
};

export default Menu;