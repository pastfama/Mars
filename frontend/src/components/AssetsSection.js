import React from 'react';

const AssetsSection = ({ colony }) => {
  if (!colony) {
    return <div>Loading...</div>;
  }

  return (
    <div className="assets-section">
      <h2>Colony Resources</h2>
      <ul>
        {Object.entries(colony.resources).map(([resource, amount]) => (
          <li key={resource}>
            {resource}: {amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetsSection;