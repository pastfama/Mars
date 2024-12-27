import React from 'react';
import '../styles/ProfileSection.css';

const ProfileSection = ({ mainPlayer, getProgressBarColor }) => {
  return (
    <div className="content-section">
      <h2>Profile</h2>
      {mainPlayer ? (
        <div>
          <p>Name: {mainPlayer.name}</p>
          <p>Age: {mainPlayer.age}</p>
          <p>Role: {mainPlayer.role}</p>
          <div className="characteristics">
            {['health', 'happiness', 'smarts', 'looks'].map((char) => (
              <div className="characteristic" key={char}>
                <p>{char.charAt(0).toUpperCase() + char.slice(1)}</p>
                <div className="progress-bar">
                  <div
                    className={`progress ${getProgressBarColor(mainPlayer[char])}`}
                    style={{
                      width: `${mainPlayer[char]}%`,
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