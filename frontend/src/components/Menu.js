import React from 'react';
import ProfileButton from './ProfileButton';
import RelationshipsButton from './RelationshipsButton';
import ActivitiesButton from './ActivitiesButton';
import AssetsButton from './AssetsButton';
import SettingsButton from './SettingsButton';

const Menu = ({ setActiveSection, colony, yearsTillElections }) => (
  <div className="menu">
    <ProfileButton setActiveSection={setActiveSection} />
    <RelationshipsButton setActiveSection={setActiveSection} />
    <ActivitiesButton setActiveSection={setActiveSection} />
    <AssetsButton setActiveSection={setActiveSection} />
    <SettingsButton setActiveSection={setActiveSection} />
    {colony && (
      <div className="leader-info">
        {colony.leader && <p>Leader: {colony.leader.name}</p>}
        <p>Years till elections: {yearsTillElections}</p>
      </div>
    )}
  </div>
);

export default Menu;