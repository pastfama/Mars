import React from 'react';

const LeaderInfo = ({ colony, yearsTillElections }) => (
  <div className="leader-info">
    {colony.leader && <p>Leader: {colony.leader.name}</p>}
    <p>Years till elections: {yearsTillElections}</p>
  </div>
);

export default LeaderInfo;