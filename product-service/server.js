/**
 * E-Commerce Microservice - Product Service
 * Member: IT22062888
 *
 * Port: 4001
 * Features:
 * - MongoDB with Mongoose for persistent storage
 * - MVC pattern: Validators, Controllers, Routes in separate files
 * - Full CRUD operations (GET all, GET by ID, POST, PUT, DELETE)
 * - Swagger/OpenAPI documentation
 * - Input validation for all endpoints
 */

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const createProductRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();
const PORT = 4001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/product_service_db';

// Middleware
app.use(express.json());

// Product schema and model
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API',
      version: '1.0.0',
      description: 'Product microservice for e-commerce platform'
    },
    servers: [{ url: `http://localhost:${PORT}` }]
  },
  apis: ['./routes/productRoutes.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register routes
app.use(createProductRoutes(Product));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'product-service', status: 'UP' });
});

// Start server
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

