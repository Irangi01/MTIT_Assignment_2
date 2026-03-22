/**
 * E-Commerce Microservice - Product Service
 * Member: X
 *
 * Assignment notes:
 * - This service uses a local array as temporary storage (no database).
 * - It includes a simple REST API with 3 routes:
 *   1) GET all products
 *   2) POST a new product
 *   3) GET product by ID
 * - Swagger UI is integrated to document and test endpoints.
 */

const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 4003; // Unique port assigned from the allowed range (4001-4005)

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Simple in-memory array to store product data for this assignment
const products = [
  { id: 1, name: 'Keyboard', price: 49.99 },
  { id: 2, name: 'Mouse', price: 19.99 }
];

/**
 * Swagger/OpenAPI setup
 * We define basic API metadata and tell swagger-jsdoc where route docs are located.
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API',
      version: '1.0.0',
      description: 'Simple Product microservice API for MTIT Assignment 2'
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

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 */
app.get('/products', (req, res) => {
  res.status(200).json(products);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Headphones
 *               price:
 *                 type: number
 *                 example: 59.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request body
 */
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  // Basic validation for required fields
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ message: 'name (string) and price (number) are required.' });
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price
  };

  products.push(newProduct);
  return res.status(201).json(newProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  return res.status(200).json(product);
});

// Health endpoint to quickly verify the service is running
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'product-service', status: 'UP' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Product Service is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
