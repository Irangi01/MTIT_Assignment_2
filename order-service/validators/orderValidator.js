/**
 * Order Service - Validators
 */

const validateCreateOrder = (req, res, next) => {
  const { customerName, totalAmount, status } = req.body;

  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    return res.status(400).json({ message: 'Validation error: "customerName" must be a non-empty string.' });
  }

  if (totalAmount === undefined || typeof totalAmount !== 'number' || totalAmount < 0) {
    return res.status(400).json({ message: 'Validation error: "totalAmount" must be a number >= 0.' });
  }

  next();
};

const validateUpdateOrder = (req, res, next) => {
  const { customerName, totalAmount, status } = req.body;

  if (customerName !== undefined && (typeof customerName !== 'string' || customerName.trim().length === 0)) {
    return res.status(400).json({ message: 'Validation error: "customerName" must be a non-empty string.' });
  }

  if (totalAmount !== undefined && (typeof totalAmount !== 'number' || totalAmount < 0)) {
    return res.status(400).json({ message: 'Validation error: "totalAmount" must be a number >= 0.' });
  }

  next();
};

const validateOrderId = (req, res, next) => {
  const { id } = req.params;
  const mongoose = require('mongoose');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Validation error: Invalid order ID format.' });
  }

  next();
};

module.exports = { validateCreateOrder, validateUpdateOrder, validateOrderId };
