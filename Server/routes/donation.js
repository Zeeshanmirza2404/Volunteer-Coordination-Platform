/**
 * Donation Routes
 * Handle donation-related endpoints
 */

const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * POST /api/donate/event/:eventId
 * Create a donation for a specific event (deprecated - use payment endpoints)
 */
router.post('/event/:eventId', verifyToken, async (req, res, next) => {
  try {
    const donor = req.user.id;
    const { amount } = req.body;
    const eventId = req.params.eventId;

    // Validation
    if (!amount || amount < 1) {
      const error = new Error('Invalid donation amount');
      error.statusCode = 400;
      return next(error);
    }

    // Find the event to get the NGO
    const event = await Event.findById(eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      return next(error);
    }

    const ngo = event.ngo;

    const donation = new Donation({
      donor,
      amount,
      ngo,
      event: eventId,
      paymentStatus: 'completed'
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation successful',
      data: donation
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/donate
 * Get all donations (with optional filters)
 */
router.get('/', async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .populate('ngo', 'name')
      .populate('event', 'title')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/donate/:donationId
 * Get a specific donation by ID
 */
router.get('/:donationId', async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.donationId)
      .populate('donor', 'name email')
      .populate('ngo', 'name')
      .populate('event', 'title');

    if (!donation) {
      const error = new Error('Donation not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
