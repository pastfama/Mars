const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Mars: A New Hope Backend');
});

app.post('/new-game', (req, res) => {
  const { playerName } = req.body;
  res.json({ message: `New game started for ${playerName}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
