/**
 * Review Service - Routes
 */

const express = require('express');
const reviewController = require('../controllers/reviewController');
const { validateCreateReview, validateUpdateReview, validateReviewId } = require('../validators/reviewValidator');

const createReviewRoutes = (Review) => {
  const router = express.Router();

  /**
   * @swagger
   * /reviews:
   *   get:
   *     summary: Get all reviews
   *     tags: [Reviews]
   *     responses:
   *       200:
   *         description: List of all reviews
   *   post:
   *     summary: Create a new review
   *     tags: [Reviews]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - productId
   *               - reviewerName
   *               - rating
   *             properties:
   *               productId:
   *                 type: number
   *               reviewerName:
   *                 type: string
   *               rating:
   *                 type: number
   *               comment:
   *                 type: string
   *     responses:
   *       201:
   *         description: Review created
   * /reviews/{id}:
   *   get:
   *     summary: Get review by ID
   *     tags: [Reviews]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Review found
   *   put:
   *     summary: Update review by ID
   *     tags: [Reviews]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               productId:
   *                 type: number
   *               reviewerName:
   *                 type: string
   *               rating:
   *                 type: number
   *               comment:
   *                 type: string
   *     responses:
   *       200:
   *         description: Review updated
   *   delete:
   *     summary: Delete review by ID
   *     tags: [Reviews]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Review deleted
   */

  router.get('/reviews', reviewController.getAllReviews(Review));
  router.post('/reviews', validateCreateReview, reviewController.createReview(Review));
  router.get('/reviews/:id', validateReviewId, reviewController.getReviewById(Review));
  router.put('/reviews/:id', validateReviewId, validateUpdateReview, reviewController.updateReview(Review));
  router.delete('/reviews/:id', validateReviewId, reviewController.deleteReview(Review));

  return router;
};

module.exports = createReviewRoutes;
