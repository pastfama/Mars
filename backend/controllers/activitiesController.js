const fs = require('fs');
const path = require('path');

const getActivities = (req, res) => {
  const lifeStage = req.params.lifeStage;
  const activitiesPath = path.join(__dirname, '../assets/activities.json');

  fs.readFile(activitiesPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read activities file' });
    }

    const activities = JSON.parse(data);
    if (activities[lifeStage]) {
      res.status(200).json({ activities: activities[lifeStage] });
    } else {
      res.status(404).json({ error: 'Life stage not found' });
    }
  });
};

module.exports = { getActivities };