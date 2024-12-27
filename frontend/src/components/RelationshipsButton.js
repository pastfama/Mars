import React from 'react';

const RelationshipsButton = ({ setActiveSection }) => (
  <div className="menu-item" onClick={() => setActiveSection('Relationships')}>Relationships</div>
);

export default RelationshipsButton;