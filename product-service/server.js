/**
 * E-Commerce Microservice - Product Service
 * Member: X
 *
 * Assignment notes:
 * - This service now uses MongoDB (with Mongoose) for persistent storage.
 * - It includes a simple REST API with 3 routes:
 *   1) GET all products
 *   2) POST a new product
 *   3) GET product by ID
 * - Swagger UI is integrated to document and test endpoints.
 */

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
const PORT = 4001; // Port aligned with API Gateway mapping
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/product_service_db';

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Product schema and model for MongoDB collection
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

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
  Product.find()
    .sort({ createdAt: -1 })
    .then((products) => res.status(200).json(products))
    .catch((error) =>
      res.status(500).json({ message: 'Failed to fetch products.', error: error.message })
    );
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

  Product.create({ name, price })
    .then((newProduct) => res.status(201).json(newProduct))
    .catch((error) =>
      res.status(500).json({ message: 'Failed to create product.', error: error.message })
    );
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
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
app.get('/products/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID format.' });
  }

  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      return res.status(200).json(product);
    })
    .catch((error) =>
      res.status(500).json({ message: 'Failed to fetch product.', error: error.message })
    );
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
app.put('/products/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID format.' });
  }

  Product.findByIdAndUpdate(id, req.body, { new: true })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      return res.status(200).json(product);
    })
    .catch((error) =>
      res.status(500).json({ message: 'Failed to update product.', error: error.message })
    );
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID format.' });
  }

  Product.findByIdAndDelete(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      return res.status(200).json({ message: 'Product deleted successfully.' });
    })
    .catch((error) =>
      res.status(500).json({ message: 'Failed to delete product.', error: error.message })
    );
});

// Health endpoint to quickly verify the service and database connection
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({ service: 'product-service', status: 'UP', database: dbState });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Product Service connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Product Service is running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Product Service failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
