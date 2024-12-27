import React from 'react';
import '../styles/RelationshipsSection.css'; // Update this path if necessary

const RelationshipsSection = ({ relationships = [] }) => {
  const renderRelationship = (relationship) => (
    <li key={relationship.player._id}>
      <div className="relationship-item">
        <span className="relationship-name">{relationship.player.name}</span>
        <span className="relationship-type">{relationship.relationshipType}</span>
        <span className="relationship-trust">Trust Level: {relationship.trustLevel}</span>
      </div>
    </li>
  );

  const mothers = relationships.filter(r => r.relationshipType === 'mother');
  const fathers = relationships.filter(r => r.relationshipType === 'father');
  const siblings = relationships.filter(r => r.relationshipType === 'sibling');
  const relatives = relationships.filter(r => r.relationshipType === 'relative');
  const others = relationships.filter(r => !['mother', 'father', 'sibling', 'relative'].includes(r.relationshipType));

  return (
    <div className="content-section">
      <h2>Relationships</h2>
      {relationships.length > 0 ? (
        <ul>
          {mothers.length > 0 && (
            <>
              <h3>Mothers</h3>
              {mothers.map(renderRelationship)}
            </>
          )}
          {fathers.length > 0 && (
            <>
              <h3>Fathers</h3>
              {fathers.map(renderRelationship)}
            </>
          )}
          {siblings.length > 0 && (
            <>
              <h3>Siblings</h3>
              {siblings.map(renderRelationship)}
            </>
          )}
          {relatives.length > 0 && (
            <>
              <h3>Relatives</h3>
              {relatives.map(renderRelationship)}
            </>
          )}
          {others.length > 0 && (
            <>
              <h3>Other Colonists</h3>
              {others.map(renderRelationship)}
            </>
          )}
        </ul>
      ) : (
        <p>No relationships found.</p>
      )}
    </div>
  );
};

export default RelationshipsSection;