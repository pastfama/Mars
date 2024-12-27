import React, { useState, useEffect } from 'react';
import '../styles/ActivitiesSection.css';

const ActivitiesSection = ({ mainPlayer, updatePlayerStats, setActiveSection }) => {
  const [activities, setActivities] = useState([]);
  const [usedActivities, setUsedActivities] = useState({});

  useEffect(() => {
    if (mainPlayer) {
      const lifeStage = getLifeStage(mainPlayer.age);
      fetchActivities(lifeStage);
    }
  }, [mainPlayer]);

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

  return (
    <div className="activities-section">
      <h2>Activities</h2>
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity, index) => (
            <li key={index}>
              <button
                onClick={() => handleActivityClick(activity)}
                disabled={usedActivities[activity.name] >= 2}
              >
                {activity.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities available for this life stage.</p>
      )}
    </div>
  );
};

export default ActivitiesSection;