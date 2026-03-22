/**
 * E-Commerce Microservice - Order Service
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
const PORT = 4001;

// Parse JSON bodies from incoming requests
app.use(express.json());

// Temporary in-memory order list for assignment purposes
const orders = [
  { id: 1, customerName: 'Alice', totalAmount: 129.5, status: 'PENDING' },
  { id: 2, customerName: 'Bob', totalAmount: 79.99, status: 'CONFIRMED' }
];

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
  res.status(200).json(orders);
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

  const newOrder = {
    id: orders.length ? orders[orders.length - 1].id + 1 : 1,
    customerName,
    totalAmount,
    status: status || 'PENDING'
  };

  orders.push(newOrder);
  return res.status(201).json(newOrder);
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
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
app.get('/orders/:id', (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  return res.status(200).json(order);
});

app.listen(PORT, () => {
  console.log(`Order Service is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
