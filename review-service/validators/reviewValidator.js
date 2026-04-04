/**
 * Review Service - Validators
 */

const validateCreateReview = (req, res, next) => {
  const { productId, reviewerName, rating } = req.body;

  if (productId === undefined || typeof productId !== 'number') {
    return res.status(400).json({ message: 'Validation error: "productId" must be a number.' });
  }

  if (!reviewerName || typeof reviewerName !== 'string' || reviewerName.trim().length === 0) {
    return res.status(400).json({ message: 'Validation error: "reviewerName" must be a non-empty string.' });
  }

  if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Validation error: "rating" must be a number between 1 and 5.' });
  }

  next();
};

const validateUpdateReview = (req, res, next) => {
  const { productId, reviewerName, rating } = req.body;

  if (productId !== undefined && typeof productId !== 'number') {
    return res.status(400).json({ message: 'Validation error: "productId" must be a number.' });
  }

  if (reviewerName !== undefined && (typeof reviewerName !== 'string' || reviewerName.trim().length === 0)) {
    return res.status(400).json({ message: 'Validation error: "reviewerName" must be a non-empty string.' });
  }

  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
    return res.status(400).json({ message: 'Validation error: "rating" must be a number between 1 and 5.' });
  }

  next();
};

const validateReviewId = (req, res, next) => {
  const { id } = req.params;
  const mongoose = require('mongoose');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Validation error: Invalid review ID format.' });
  }

  next();
};

module.exports = { validateCreateReview, validateUpdateReview, validateReviewId };
