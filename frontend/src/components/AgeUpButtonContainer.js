import React, { useEffect, useState } from 'react';
import AgeUpSummaryPopup from './AgeUpSummaryPopup';
import axios from 'axios';

const AgeUpButtonContainer = ({ handleAgeUp, loading, summary, mainPlayer, handleRetire, setSummary, handleElections }) => {
  const [isVotingYear, setIsVotingYear] = useState(false);

  useEffect(() => {
    if (mainPlayer && mainPlayer.colony) {
      fetchVotingYearStatus(mainPlayer.colony);
    }
  }, [mainPlayer]);

  const fetchVotingYearStatus = async (colonyId) => {
    try {
      const response = await axios.get(`http://localhost:5000/colony/${colonyId}`);
      const colony = response.data.colony;
      if (colony) {
        setIsVotingYear(colony.yearsTillElection === 0);
      }
    } catch (error) {
      console.error('Error fetching voting year status:', error);
    }
  };

  return (
    <div className="age-up-button-container" style={{ textAlign: 'center', marginTop: '20px' }}>
      <button className="age-up-button" onClick={handleAgeUp} disabled={loading}>
        {loading ? 'Aging Up...' : 'Age Up'}
      </button>
      {summary && (
        <AgeUpSummaryPopup summary={summary} onClose={() => setSummary(null)}>
          <p>Voting Year: {isVotingYear ? 'Yes' : 'No'}</p>
        </AgeUpSummaryPopup>
      )}
      {isVotingYear && mainPlayer && mainPlayer.age >= 18 && (
        <button className="election-button" onClick={() => handleElections(mainPlayer.colony)}>
          Hold Elections
        </button>
      )}
      {mainPlayer && mainPlayer.age >= 60 && (
        <>
          <button className="retire-button" onClick={() => handleRetire('earth')}>Retire to Earth</button>
          <button className="retire-button" onClick={() => handleRetire('mars')}>Retire on Mars</button>
        </>
      )}
    </div>
  );
};

export default AgeUpButtonContainer;