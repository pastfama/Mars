import React from 'react';

const ActivitiesButton = ({ setActiveSection }) => (
  <div className="menu-item" onClick={() => setActiveSection('Activities')}>Activities</div>
);

export default ActivitiesButton;