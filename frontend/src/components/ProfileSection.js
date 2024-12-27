import React from 'react';
import '../styles/ProfileSection.css';

const ProfileSection = ({ mainPlayer, getProgressBarColor }) => {
  return (
    <div className="content-section">
      <h2>Profile</h2>
      {mainPlayer ? (
        <div>
          <p>Name: {mainPlayer.player.name}</p>
          <p>Age: {mainPlayer.player.age}</p>
          <p>Role: {mainPlayer.role}</p>
          <div className="characteristics">
            {['Health', 'Happiness', 'Intelligence', 'Looks'].map((char) => (
              <div className="characteristic" key={char}>
                <p>{char}</p>
                <div className="progress-bar">
                  <div
                    className={`progress ${getProgressBarColor(mainPlayer.player[char.toLowerCase()])}`}
                    style={{
                      width: `${mainPlayer.player[char.toLowerCase()]}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No main player found</p>
      )}
    </div>
  );
};

export default ProfileSection;