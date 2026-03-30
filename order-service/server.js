/**
 * E-Commerce Microservice - Order Service
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
const PORT = 4003;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/order_service_db';

// Parse JSON bodies from incoming requests
app.use(express.json());

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, default: 'PENDING', trim: true }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API',
      version: '1.0.0',
      description: 'Simple Order microservice API for MTIT Assignment 2'
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
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders
 */
app.get('/orders', (req, res) => {
  Order.find()
    .sort({ createdAt: -1 })
    .then((orders) => res.status(200).json(orders))
    .catch((error) => res.status(500).json({ message: 'Failed to fetch orders.', error: error.message }));
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - totalAmount
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Charlie
 *               totalAmount:
 *                 type: number
 *                 example: 249.99
 *               status:
 *                 type: string
 *                 example: PENDING
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request body
 */
app.post('/orders', (req, res) => {
  const { customerName, totalAmount, status } = req.body;

  if (!customerName || typeof totalAmount !== 'number') {
    return res.status(400).json({ message: 'customerName (string) and totalAmount (number) are required.' });
  }

  Order.create({ customerName, totalAmount, status: status || 'PENDING' })
    .then((newOrder) => res.status(201).json(newOrder))
    .catch((error) => res.status(500).json({ message: 'Failed to create order.', error: error.message }));
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
app.get('/orders/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID format.' });
  }

  Order.findById(id)
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      return res.status(200).json(order);
    })
    .catch((error) => res.status(500).json({ message: 'Failed to fetch order.', error: error.message }));
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID format.' });
  }

  Order.findByIdAndUpdate(id, req.body, { new: true })
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      return res.status(200).json(order);
    })
    .catch((error) => res.status(500).json({ message: 'Failed to update order.', error: error.message }));
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
app.delete('/orders/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID format.' });
  }

  Order.findByIdAndDelete(id)
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      return res.status(200).json({ message: 'Order deleted successfully.' });
    })
    .catch((error) => res.status(500).json({ message: 'Failed to delete order.', error: error.message }));
});

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({ service: 'order-service', status: 'UP', database: dbState });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Order Service connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Order Service is running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Order Service failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
