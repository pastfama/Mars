import React, { useEffect, useState } from 'react';
import '../styles/RelationshipsSection.css'; // Update this path if necessary

const RelationshipsSection = ({ mainPersonId }) => {
  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    const fetchRelationships = async () => {
      try {
        const response = await fetch(`http://localhost:5000/player/${mainPersonId}`);
        const data = await response.json();
        setRelationships(data.relationships);
        console.log('Fetched relationships:', data.relationships); // Debugging log
      } catch (error) {
        console.error('Error fetching relationships:', error);
      }
    };

    if (mainPersonId) {
      fetchRelationships();
    }
  }, [mainPersonId]);

  const renderRelationship = (relationship) => (
    <li key={relationship.player._id}>
      <div className="relationship-item">
        <span className="relationship-name">{relationship.player.name}</span>
        <span className="relationship-type">{relationship.relationshipType}</span>
        <span className="relationship-trust">Trust Level: {relationship.trustLevel}</span>
      </div>
    </li>
  );

  const parents = relationships.filter(r => r.relationshipType === 'mother' || r.relationshipType === 'father');
  const siblings = relationships.filter(r => r.relationshipType === 'sibling');
  const relatives = relationships.filter(r => r.relationshipType === 'relative');
  const others = relationships.filter(r => !['mother', 'father', 'sibling', 'relative'].includes(r.relationshipType));

  console.log('Parents:', parents); // Debugging log
  console.log('Siblings:', siblings); // Debugging log
  console.log('Relatives:', relatives); // Debugging log
  console.log('Others:', others); // Debugging log

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