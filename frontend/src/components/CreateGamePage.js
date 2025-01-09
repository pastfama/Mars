import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CreateGamePage.css';
import config from '../config'; // Import config

const CreateGamePage = () => {
  const [name, setName] = useState('Default Game Name');
  const [description, setDescription] = useState('Default Description');
  const [colonyName, setColonyName] = useState('Default Colony Name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateGame = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newGame = {
      name: name.trim() || 'Default Game Name',
      description: description.trim() || 'Default Description',
      colonyName: colonyName.trim() || 'Default Colony Name',
    };

    try {
      const response = await fetch(`${config.apiBaseUri}/game`, { // Use apiBaseUri
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Game and colony created successfully!');
        navigate(`/game/${data.game._id}`); // Navigate to the game page
      } else {
        setError(data.error || 'Failed to create game and colony');
      }
    } catch (error) {
      console.error('Error creating game and colony:', error);
      setError('Error creating game and colony');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-game-page">
      <Container>
        <Row className="justify-content-md-center">
          <Col md="6">
            <div className="create-game-form">
              <h2>Create a New Game</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleCreateGame}>
                <Form.Group controlId="formGameName">
                  <Form.Label>Game Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                <Form.Group controlId="formColonyName">
                  <Form.Label>Colony Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={colonyName}
                    onChange={(e) => setColonyName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Create Game'}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateGamePage;
