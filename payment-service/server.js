/**
 * E-Commerce Microservice - Payment Service
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
const PORT = 4002;

// Parse JSON bodies from incoming requests
app.use(express.json());

// Temporary in-memory payment list for assignment purposes
const payments = [
  { id: 1, orderId: 101, amount: 129.5, method: 'CARD', status: 'SUCCESS' },
  { id: 2, orderId: 102, amount: 79.99, method: 'CASH', status: 'PENDING' }
];

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Service API',
      version: '1.0.0',
      description: 'Simple Payment microservice API for MTIT Assignment 2'
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
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: A list of payments
 */
app.get('/payments', (req, res) => {
  res.status(200).json(payments);
});

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - amount
 *               - method
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 103
 *               amount:
 *                 type: number
 *                 example: 220.0
 *               method:
 *                 type: string
 *                 example: CARD
 *               status:
 *                 type: string
 *                 example: SUCCESS
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid request body
 */
app.post('/payments', (req, res) => {
  const { orderId, amount, method, status } = req.body;

  if (typeof orderId !== 'number' || typeof amount !== 'number' || !method) {
    return res.status(400).json({ message: 'orderId (number), amount (number), and method (string) are required.' });
  }

  const newPayment = {
    id: payments.length ? payments[payments.length - 1].id + 1 : 1,
    orderId,
    amount,
    method,
    status: status || 'PENDING'
  };

  payments.push(newPayment);
  return res.status(201).json(newPayment);
});

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment found
 *       404:
 *         description: Payment not found
 */
app.get('/payments/:id', (req, res) => {
  const id = Number(req.params.id);
  const payment = payments.find((item) => item.id === id);

  if (!payment) {
    return res.status(404).json({ message: 'Payment not found.' });
  }

  return res.status(200).json(payment);
});

app.listen(PORT, () => {
  console.log(`Payment Service is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
