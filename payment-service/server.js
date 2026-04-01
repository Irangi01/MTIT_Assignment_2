/**
 * E-Commerce Microservice - Payment Service
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
const PORT = 4004;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/payment_service_db';

// Parse JSON bodies from incoming requests
app.use(express.json());

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: Number, required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, required: true, trim: true },
    status: { type: String, default: 'PENDING', trim: true }
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

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
  Payment.find()
    .sort({ createdAt: -1 })
    .then((payments) => res.status(200).json(payments))
    .catch((error) => res.status(500).json({ message: 'Failed to fetch payments.', error: error.message }));
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

  Payment.create({ orderId, amount, method, status: status || 'PENDING' })
    .then((newPayment) => res.status(201).json(newPayment))
    .catch((error) => res.status(500).json({ message: 'Failed to create payment.', error: error.message }));
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
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment found
 *       404:
 *         description: Payment not found
 */
app.get('/payments/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid payment ID format.' });
  }

  Payment.findById(id)
    .then((payment) => {
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found.' });
      }

      return res.status(200).json(payment);
    })
    .catch((error) => res.status(500).json({ message: 'Failed to fetch payment.', error: error.message }));
});

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Update a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       404:
 *         description: Payment not found
 */
app.put('/payments/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid payment ID format.' });
  }

  Payment.findByIdAndUpdate(id, req.body, { new: true })
    .then((payment) => {
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found.' });
      }

      return res.status(200).json(payment);
    })
    .catch((error) => res.status(500).json({ message: 'Failed to update payment.', error: error.message }));
});

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Delete a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 */
app.delete('/payments/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid payment ID format.' });
  }

  Payment.findByIdAndDelete(id)
    .then((payment) => {
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found.' });
      }

      return res.status(200).json({ message: 'Payment deleted successfully.' });
    })
    .catch((error) => res.status(500).json({ message: 'Failed to delete payment.', error: error.message }));
});

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({ service: 'payment-service', status: 'UP', database: dbState });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Payment Service connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Payment Service is running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Payment Service failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
