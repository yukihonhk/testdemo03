const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// In-memory storage for timesheets (in production, use a database)
let timesheets = [];
let nextId = 1;

// Get all timesheets
router.get('/', verifyToken, (req, res) => {
  try {
    // Filter by query parameters if provided
    let filtered = [...timesheets];
    
    if (req.query.userId) {
      filtered = filtered.filter(t => t.userId === req.query.userId);
    }
    
    if (req.query.startDate && req.query.endDate) {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date >= new Date(req.query.startDate) && date <= new Date(req.query.endDate);
      });
    }
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve timesheets' });
  }
});

// Get timesheet by ID
router.get('/:id', verifyToken, (req, res) => {
  try {
    const timesheet = timesheets.find(t => t.id === parseInt(req.params.id));
    if (!timesheet) {
      return res.status(404).json({ error: 'Timesheet not found' });
    }
    res.json(timesheet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve timesheet' });
  }
});

// Create new timesheet entry
router.post('/',
  verifyToken,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('jobTypeId').isInt().withMessage('Job type ID is required'),
    body('hours').isFloat({ min: 0.1, max: 24 }).withMessage('Hours must be between 0.1 and 24'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const timesheet = {
        id: nextId++,
        userId: req.body.userId,
        userName: req.body.userName || 'Unknown User',
        date: req.body.date,
        jobTypeId: req.body.jobTypeId,
        jobTypeName: req.body.jobTypeName || '',
        hours: parseFloat(req.body.hours),
        description: req.body.description,
        projectName: req.body.projectName || '',
        status: 'submitted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      timesheets.push(timesheet);
      res.status(201).json(timesheet);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create timesheet entry' });
    }
  }
);

// Update timesheet entry
router.put('/:id',
  verifyToken,
  [
    body('date').optional().isISO8601(),
    body('jobTypeId').optional().isInt(),
    body('hours').optional().isFloat({ min: 0.1, max: 24 }),
    body('description').optional().notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const index = timesheets.findIndex(t => t.id === parseInt(req.params.id));
      if (index === -1) {
        return res.status(404).json({ error: 'Timesheet not found' });
      }

      const updated = {
        ...timesheets[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      timesheets[index] = updated;
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update timesheet entry' });
    }
  }
);

// Delete timesheet entry
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const index = timesheets.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Timesheet not found' });
    }

    timesheets.splice(index, 1);
    res.json({ message: 'Timesheet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete timesheet entry' });
  }
});

// Get summary/statistics
router.get('/stats/summary', verifyToken, (req, res) => {
  try {
    const userId = req.query.userId;
    const filtered = userId 
      ? timesheets.filter(t => t.userId === userId)
      : timesheets;

    const totalHours = filtered.reduce((sum, t) => sum + t.hours, 0);
    const totalEntries = filtered.length;
    
    const byJobType = filtered.reduce((acc, t) => {
      if (!acc[t.jobTypeName]) {
        acc[t.jobTypeName] = 0;
      }
      acc[t.jobTypeName] += t.hours;
      return acc;
    }, {});

    res.json({
      totalHours,
      totalEntries,
      byJobType,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve summary' });
  }
});

module.exports = router;
