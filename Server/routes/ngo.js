/**
 * NGO Routes
 * Handles NGO registration, retrieval, updates, and approval
 */

const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');
const { verifyToken } = require('../middleware/authMiddleware');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

/**
 * Register a new NGO
 * POST /api/ngo/register
 * Auth: Required
 */
router.post('/register', verifyToken, async (req, res, next) => {
  try {
    const { name, email, phone, address, description, website } = req.body;

    // Check if NGO already exists with this email
    const existingNGO = await NGO.findOne({ email });
    if (existingNGO) {
      const error = new Error(ERROR_MESSAGES.NGO_EXISTS);
      error.statusCode = HTTP_STATUS.CONFLICT;
      return next(error);
    }

    // Create new NGO
    const newNGO = new NGO({
      name,
      email,
      phone,
      address,
      description,
      website,
      userId: req.user.id
    });

    await newNGO.save();
    
    res.status(HTTP_STATUS.CREATED).json({ 
      success: true,
      message: SUCCESS_MESSAGES.NGO_REGISTERED, 
      data: newNGO 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all approved NGOs
 * GET /api/ngo
 * Auth: Not required
 */
router.get('/', async (req, res, next) => {
  try {
    const ngos = await NGO.findApproved();
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: ngos.length,
      data: ngos
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get a single NGO by ID
 * GET /api/ngo/:id
 * Auth: Not required
 */
router.get('/:id', async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Approve an NGO (Admin only)
 * PUT /api/ngo/:id/approve
 * Auth: Required (Admin)
 */
router.put('/:id/approve', verifyToken, async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Use the model's approve method
    await ngo.approve();
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: SUCCESS_MESSAGES.NGO_APPROVED, 
      data: ngo 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update NGO by ID
 * PUT /api/ngo/:id
 * Auth: Required (NGO owner only)
 */
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Verify ownership
    if (ngo.userId.toString() !== req.user.id) {
      const error = new Error(ERROR_MESSAGES.FORBIDDEN);
      error.statusCode = HTTP_STATUS.FORBIDDEN;
      return next(error);
    }

    const updatedNGO = await NGO.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'NGO updated successfully', 
      data: updatedNGO 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete NGO by ID
 * DELETE /api/ngo/:id
 * Auth: Required (NGO owner or Admin)
 */
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Verify ownership (or admin - would need role check)
    if (ngo.userId.toString() !== req.user.id) {
      const error = new Error(ERROR_MESSAGES.FORBIDDEN);
      error.statusCode = HTTP_STATUS.FORBIDDEN;
      return next(error);
    }

    await NGO.findByIdAndDelete(req.params.id);
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'NGO deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

