const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// GET all NGOs (for admin approval)
router.get('/ngos', async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch NGOs', error: err.message });
  }
});

// Approve NGO
router.put('/approve/:id', async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(req.params.id, { isApproved: true });
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });
    res.json({ message: 'NGO verified', ngo });
  } catch (err) {
    res.status(500).json({ message: 'Error approving NGO', error: err.message });
  }
});

module.exports = router;
