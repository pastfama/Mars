import React from 'react';

const AssetsButton = ({ setActiveSection }) => (
  <div className="menu-item" onClick={() => setActiveSection('Assets')}>Assets</div>
);

export default AssetsButton;