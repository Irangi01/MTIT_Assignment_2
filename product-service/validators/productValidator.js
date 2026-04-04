/**
 * Product Service - Validators
 * Validates incoming request data
 */

// Validate product creation
const validateCreateProduct = (req, res, next) => {
  const { name, price } = req.body;

  // Check if name exists and is a non-empty string
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Validation error: "name" must be a non-empty string.' 
    });
  }

  // Check if price exists, is a number, and is >= 0
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ 
      message: 'Validation error: "price" must be a number >= 0.' 
    });
  }

  next();
};

// Validate product update
const validateUpdateProduct = (req, res, next) => {
  const { name, price } = req.body;

  // If name is provided, validate it
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Validation error: "name" must be a non-empty string.' 
      });
    }
  }

  // If price is provided, validate it
  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ 
        message: 'Validation error: "price" must be a number >= 0.' 
      });
    }
  }

  next();
};

// Validate product ID format
const validateProductId = (req, res, next) => {
  const { id } = req.params;
  const mongoose = require('mongoose');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      message: 'Validation error: Invalid product ID format.' 
    });
  }

  next();
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId
};
