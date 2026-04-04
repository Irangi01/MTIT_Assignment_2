/**
 * User Service - Validators
 */

const validateCreateUser = (req, res, next) => {
  const { name, email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: 'Validation error: "name" must be a non-empty string.' });
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Validation error: "email" must be a valid email format.' });
  }

  next();
};

const validateUpdateUser = (req, res, next) => {
  const { name, email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    return res.status(400).json({ message: 'Validation error: "name" must be a non-empty string.' });
  }

  if (email !== undefined && !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Validation error: "email" must be a valid email format.' });
  }

  next();
};

const validateUserId = (req, res, next) => {
  const { id } = req.params;
  const mongoose = require('mongoose');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Validation error: Invalid user ID format.' });
  }

  next();
};

module.exports = { validateCreateUser, validateUpdateUser, validateUserId };
