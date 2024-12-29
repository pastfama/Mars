import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import '../styles/ActivitiesSection.css'; // Update this path if necessary

const ActivitiesSection = ({ mainPlayer, updatePlayerStats, setActiveSection, isVotingYear }) => {
  const [activities, setActivities] = useState([]);
  const [usedActivities, setUsedActivities] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (mainPlayer) {
      const lifeStage = getLifeStage(mainPlayer.age);
      fetchActivities(lifeStage);
    }
  }, [mainPlayer]);

  useEffect(() => {
    if (isVotingYear && mainPlayer.age >= 18) {
      fetchCandidates();
    }
  }, [isVotingYear, mainPlayer.age]);

  const getLifeStage = (age) => {
    if (age <= 12) return 'child';
    if (age <= 19) return 'teenager';
    if (age <= 64) return 'adult';
    return 'senior';
  };

  const fetchActivities = async (lifeStage) => {
    try {
      const response = await fetch(`http://localhost:5000/activities/${lifeStage}`);
      const data = await response.json();
      setActivities(data.activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/colony/${mainPlayer.colony}/candidates`);
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleActivityClick = (activity) => {
    const activityCount = usedActivities[activity.name] || 0;
    if (activityCount < 2) {
      updatePlayerStats(activity.effects);
      setUsedActivities({
        ...usedActivities,
        [activity.name]: activityCount + 1
      });
      setActiveSection('Profile'); // Change the active section to Profile
    }
  };

  const handleVote = async () => {
    try {
      await axios.post(`http://localhost:5000/colony/${mainPlayer.colony}/vote`, { voterId: mainPlayer._id, candidateId: selectedCandidate });
      alert('Vote cast successfully!');
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  return (
    <div className="activities-section">
      <h2>Activities</h2>
      {activities.map(activity => (
        <Button key={activity.name} onClick={() => handleActivityClick(activity)}>
          {activity.name}
        </Button>
      ))}
      {isVotingYear && mainPlayer.age >= 18 && (
        <div className="voting-section">
          <h3>Election Year! Cast Your Vote</h3>
          <div className="candidates-list">
            {candidates.map(candidate => (
              <div key={candidate._id} className="candidate-item">
                <input
                  type="radio"
                  id={candidate._id}
                  name="candidate"
                  value={candidate._id}
                  onChange={() => setSelectedCandidate(candidate._id)}
                />
                <label htmlFor={candidate._id}>{candidate.name}</label>
              </div>
            ))}
          </div>
          <Button onClick={handleVote} disabled={!selectedCandidate}>Vote</Button>
        </div>
      )}
    </div>
  );
};

export default ActivitiesSection;