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

  const parents = relationships.filter(r => r.relationshipType === 'parent');
  const siblings = relationships.filter(r => r.relationshipType === 'sibling');
  const relatives = relationships.filter(r => r.relationshipType === 'relative');
  const others = relationships.filter(r => !['parent', 'sibling', 'relative'].includes(r.relationshipType));

  return (
    <div className="content-section">
      <h2>Relationships</h2>
      {relationships.length > 0 ? (
        <ul>
          {parents.length > 0 && (
            <>
              <h3>Parents</h3>
              {parents.map(renderRelationship)}
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