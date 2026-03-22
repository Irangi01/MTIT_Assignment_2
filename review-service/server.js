/**
 * E-Commerce Microservice - Review Service
 * Member: X
 *
 * Assignment notes:
 * - Uses local in-memory array (no database for now).
 * - Provides 3 required routes: GET all, POST new, GET by ID.
 * - Swagger UI is enabled for API documentation and testing.
 */

const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 4004;

// Parse JSON bodies from incoming requests
app.use(express.json());

// Temporary in-memory review list for assignment purposes
const reviews = [
  { id: 1, productId: 1, reviewerName: 'Nimal', rating: 4, comment: 'Good quality' },
  { id: 2, productId: 2, reviewerName: 'Sahan', rating: 5, comment: 'Excellent product' }
];

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
  res.status(200).json(reviews);
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

  const newReview = {
    id: reviews.length ? reviews[reviews.length - 1].id + 1 : 1,
    productId,
    reviewerName,
    rating,
    comment: comment || ''
  };

  reviews.push(newReview);
  return res.status(201).json(newReview);
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
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 */
app.get('/reviews/:id', (req, res) => {
  const id = Number(req.params.id);
  const review = reviews.find((item) => item.id === id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found.' });
  }

  return res.status(200).json(review);
});

app.listen(PORT, () => {
  console.log(`Review Service is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
