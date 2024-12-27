import React from 'react';

const SettingsButton = ({ setActiveSection }) => (
  <div className="menu-item" onClick={() => setActiveSection('Settings')}>Settings</div>
);

export default SettingsButton;