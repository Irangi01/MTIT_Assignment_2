/**
 * E-Commerce Microservice - Order Service
 * Member: IT22063182
 *
 * Port: 4003
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
const createOrderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const PORT = 4003;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/order_service_db';

// Middleware
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
  apis: ['./routes/orderRoutes.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register Order routes
app.use(createOrderRoutes(Order));

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
