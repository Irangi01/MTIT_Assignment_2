/**
 * E-Commerce Microservice - Review Service
 * Member: X
 *
 * Assignment notes:
 * - Uses MongoDB (with Mongoose) for persistent storage.
 * - Provides 3 required routes: GET all, POST new, GET by ID.
 * - Swagger UI is enabled for API documentation and testing.
 */

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
const PORT = 4005;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/review_service_db';

// Parse JSON bodies from incoming requests
app.use(express.json());

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    reviewerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Review Service API',
      version: '1.0.0',
      description: 'Simple Review microservice API for MTIT Assignment 2'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: [__filename]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of reviews
 */
app.get('/reviews', (req, res) => {
  Review.find()
    .sort({ createdAt: -1 })
    .then((reviews) => res.status(200).json(reviews))
    .catch((error) => res.status(500).json({ message: 'Failed to fetch reviews.', error: error.message }));
});

/**
 * @swagger
 * /reviews:
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
 *                 type: integer
 *                 example: 1
 *               reviewerName:
 *                 type: string
 *                 example: Kamal
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Very useful item
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid request body
 */
app.post('/reviews', (req, res) => {
  const { productId, reviewerName, rating, comment } = req.body;

  if (typeof productId !== 'number' || !reviewerName || typeof rating !== 'number') {
    return res.status(400).json({ message: 'productId (number), reviewerName (string), and rating (number) are required.' });
  }

  Review.create({ productId, reviewerName, rating, comment: comment || '' })
    .then((newReview) => res.status(201).json(newReview))
    .catch((error) => res.status(500).json({ message: 'Failed to create review.', error: error.message }));
});

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 */
app.get('/reviews/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid review ID format.' });
  }

  Review.findById(id)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ message: 'Review not found.' });
      }

      return res.status(200).json(review);
    })
    .catch((error) => res.status(500).json({ message: 'Failed to fetch review.', error: error.message }));
});

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               reviewerName:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 */
app.put('/reviews/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid review ID format.' });
  }

  Review.findByIdAndUpdate(id, req.body, { new: true })
    .then((review) => {
      if (!review) {
        return res.status(404).json({ message: 'Review not found.' });
      }

      return res.status(200).json(review);
    })
    .catch((error) => res.status(500).json({ message: 'Failed to update review.', error: error.message }));
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
app.delete('/reviews/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid review ID format.' });
  }

  Review.findByIdAndDelete(id)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ message: 'Review not found.' });
      }

      return res.status(200).json({ message: 'Review deleted successfully.' });
    })
    .catch((error) => res.status(500).json({ message: 'Failed to delete review.', error: error.message }));
});

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({ service: 'review-service', status: 'UP', database: dbState });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Review Service connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Review Service is running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Review Service failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
