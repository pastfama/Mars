import React from 'react';

const AgeUpSummaryPopup = ({ summary, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Year Summary</h2>
        <p>Aged Up Players: {summary.agedUpPlayers}</p>
        <p>Deceased Players: {summary.deceasedPlayers}</p>
        <p>New Players: {summary.newPlayers}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AgeUpSummaryPopup;