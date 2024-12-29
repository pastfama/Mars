import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Collapse } from 'react-bootstrap';
import axios from 'axios';
import '../styles/RelationshipsSection.css'; // Update this path if necessary

const RelationshipsSection = ({ playerId }) => {
  const [relationships, setRelationships] = useState([]);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  useEffect(() => {
    if (!playerId) {
      console.error('Player ID is undefined');
      return;
    }

    const fetchRelationships = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/player/${playerId}/relationships`);
        setRelationships(response.data.relationships);
      } catch (error) {
        console.error('Error fetching relationships:', error);
      }
    };

    fetchRelationships();
  }, [playerId]);

  const handleToggleSubmenu = (playerId) => {
    setOpenSubmenu(openSubmenu === playerId ? null : playerId);
  };

  const getProgressBarColor = (value) => {
    if (value > 75) return 'success';
    if (value > 50) return 'info';
    if (value > 25) return 'warning';
    return 'danger';
  };

  return (
    <div className="relationships-section">
      <h2>Relationships</h2>
      <ListGroup>
        {relationships.map((relationship) => (
          relationship && relationship.player && (
            <ListGroup.Item key={relationship.player._id}>
              <Button
                variant="link"
                onClick={() => handleToggleSubmenu(relationship.player._id)}
                aria-controls={`submenu-${relationship.player._id}`}
                aria-expanded={openSubmenu === relationship.player._id}
              >
                {relationship.player.name} ({relationship.relationshipType})
              </Button>
              <div className="relationship-bar">
                <div
                  className={`relationship-progress ${getProgressBarColor(relationship.trustLevel)}`}
                  style={{
                    width: `${relationship.trustLevel}%`,
                  }}
                ></div>
              </div>
              <Collapse in={openSubmenu === relationship.player._id}>
                <div id={`submenu-${relationship.player._id}`}>
                  <Button variant="secondary" className="interaction-button">Chat</Button>
                  <Button variant="secondary" className="interaction-button">Gift</Button>
                  <Button variant="secondary" className="interaction-button">Insult</Button>
                  <Button variant="secondary" className="interaction-button">Compliment</Button>
                </div>
              </Collapse>
            </ListGroup.Item>
          )
        ))}
      </ListGroup>
    </div>
  );
};

export default RelationshipsSection;