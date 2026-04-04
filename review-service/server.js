/**
 * E-Commerce Microservice - Review Service
 * Member: IT22586384
 *
 * Port: 4005
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
const createReviewRoutes = require('./routes/reviewRoutes');

dotenv.config();

const app = express();
const PORT = 4005;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/review_service_db';

// Middleware
app.use(express.json());

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    reviewerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

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
  apis: ['./routes/reviewRoutes.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register Review routes
app.use(createReviewRoutes(Review));

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({ service: 'review-service', status: 'UP', database: dbState });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Review Service connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Review Service is running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Review Service failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
