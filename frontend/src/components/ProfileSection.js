import React from 'react';

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
            <div className="characteristic">
              <p>Health</p>
              <div className="progress-bar">
                <div
                  className={`progress ${getProgressBarColor(mainPlayer.player.health)}`}
                  style={{
                    width: `${mainPlayer.player.health}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="characteristic">
              <p>Happiness</p>
              <div className="progress-bar">
                <div
                  className={`progress ${getProgressBarColor(mainPlayer.player.happiness)}`}
                  style={{
                    width: `${mainPlayer.player.happiness}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="characteristic">
              <p>Intelligence</p>
              <div className="progress-bar">
                <div
                  className={`progress ${getProgressBarColor(mainPlayer.player.intelligence)}`}
                  style={{
                    width: `${mainPlayer.player.intelligence}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="characteristic">
              <p>Looks</p>
              <div className="progress-bar">
                <div
                  className={`progress ${getProgressBarColor(mainPlayer.player.looks)}`}
                  style={{
                    width: `${mainPlayer.player.looks}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No main player found</p>
      )}
    </div>
  );
};

export default ProfileSection;