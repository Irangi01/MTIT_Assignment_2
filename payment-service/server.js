/**
 * E-Commerce Microservice - Payment Service
 * Member: IT22894960
 *
 * Port: 4004
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
const createPaymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();
const PORT = 4004;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/payment_service_db';

// Middleware
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
  apis: ['./routes/paymentRoutes.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register Payment routes
app.use(createPaymentRoutes(Payment));

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
