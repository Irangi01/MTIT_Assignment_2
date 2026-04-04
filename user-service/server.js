/**
 * E-Commerce Microservice - User Service
 * Member: IT22290960
 *
 * Port: 4002
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
const createUserRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = 4002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/user_service_db';

// Middleware
app.use(express.json());

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'Simple User microservice API for MTIT Assignment 2'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: ['./routes/userRoutes.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register User routes
app.use(createUserRoutes(User));

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({ service: 'user-service', status: 'UP', database: dbState });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('User Service connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`User Service is running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('User Service failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
