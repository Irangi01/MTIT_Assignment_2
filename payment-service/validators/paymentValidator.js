/**
 * Payment Service - Validators
 */

const validateCreatePayment = (req, res, next) => {
  const { orderId, amount, method } = req.body;

  if (orderId === undefined || typeof orderId !== 'number') {
    return res.status(400).json({ message: 'Validation error: "orderId" must be a number.' });
  }

  if (amount === undefined || typeof amount !== 'number' || amount < 0) {
    return res.status(400).json({ message: 'Validation error: "amount" must be a number >= 0.' });
  }

  if (!method || typeof method !== 'string' || method.trim().length === 0) {
    return res.status(400).json({ message: 'Validation error: "method" must be a non-empty string.' });
  }

  next();
};

const validateUpdatePayment = (req, res, next) => {
  const { orderId, amount, method } = req.body;

  if (orderId !== undefined && typeof orderId !== 'number') {
    return res.status(400).json({ message: 'Validation error: "orderId" must be a number.' });
  }

  if (amount !== undefined && (typeof amount !== 'number' || amount < 0)) {
    return res.status(400).json({ message: 'Validation error: "amount" must be a number >= 0.' });
  }

  if (method !== undefined && (typeof method !== 'string' || method.trim().length === 0)) {
    return res.status(400).json({ message: 'Validation error: "method" must be a non-empty string.' });
  }

  next();
};

const validatePaymentId = (req, res, next) => {
  const { id } = req.params;
  const mongoose = require('mongoose');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Validation error: Invalid payment ID format.' });
  }

  next();
};

module.exports = { validateCreatePayment, validateUpdatePayment, validatePaymentId };
