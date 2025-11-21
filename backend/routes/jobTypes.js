const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const jobTypes = require('../data/jobTypes');

// Get all job types
router.get('/', verifyToken, (req, res) => {
  try {
    res.json(jobTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job types' });
  }
});

// Get job type by ID
router.get('/:id', verifyToken, (req, res) => {
  try {
    const jobType = jobTypes.find(jt => jt.id === parseInt(req.params.id));
    if (!jobType) {
      return res.status(404).json({ error: 'Job type not found' });
    }
    res.json(jobType);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job type' });
  }
});

// Get job types by category
router.get('/category/:category', verifyToken, (req, res) => {
  try {
    const filtered = jobTypes.filter(jt => 
      jt.category.toLowerCase() === req.params.category.toLowerCase()
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job types by category' });
  }
});

module.exports = router;
