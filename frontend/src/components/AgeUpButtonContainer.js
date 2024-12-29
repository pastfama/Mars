import React from 'react';
import AgeUpSummaryPopup from './AgeUpSummaryPopup';

const AgeUpButtonContainer = ({ handleAgeUp, loading, summary, isVotingYear, mainPlayer, handleRetire, setSummary }) => (
  <div className="age-up-button-container" style={{ textAlign: 'center', marginTop: '20px' }}>
    <button className="age-up-button" onClick={handleAgeUp} disabled={loading}>
      {loading ? 'Aging Up...' : 'Age Up'}
    </button>
    {summary && (
      <AgeUpSummaryPopup summary={summary} onClose={() => setSummary(null)}>
        <p>Voting Year: {isVotingYear ? 'Yes' : 'No'}</p>
      </AgeUpSummaryPopup>
    )}
    {mainPlayer && mainPlayer.age >= 60 && (
      <>
        <button className="retire-button" onClick={() => handleRetire('earth')}>Retire to Earth</button>
        <button className="retire-button" onClick={() => handleRetire('mars')}>Retire on Mars</button>
      </>
    )}
  </div>
);

export default AgeUpButtonContainer;