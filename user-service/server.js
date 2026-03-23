/**
 * E-Commerce Microservice - User Service
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
const PORT = 4002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/user_service_db';

// Parse JSON bodies from incoming requests
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
  apis: [__filename]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 */
app.get('/users', (req, res) => {
  User.find()
    .sort({ createdAt: -1 })
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(500).json({ message: 'Failed to fetch users.', error: error.message }));
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kasun
 *               email:
 *                 type: string
 *                 example: kasun@example.com
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 */
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'name (string) and email (string) are required.' });
  }

  User.create({ name, email })
    .then((newUser) => res.status(201).json(newUser))
    .catch((error) => res.status(500).json({ message: 'Failed to create user.', error: error.message }));
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID format.' });
  }

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      return res.status(200).json(user);
    })
    .catch((error) => res.status(500).json({ message: 'Failed to fetch user.', error: error.message }));
});

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
